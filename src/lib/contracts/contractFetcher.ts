import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import axios from 'axios';

import { getFallbackProvider, getProvider } from "../rpc";
import { RAIJINS_NFTS } from "config/staking";

export const contractFetcher =
  <T>(library: Web3Provider, contractInfo: any, additionalArgs: any[]) =>
    (...args: any): Promise<T> => {
      // eslint-disable-next-line
      const [id, chainId, arg0, arg1, ...params] = args[0];
      const provider = getProvider(library, chainId);
      const method = ethers.utils.isAddress(arg0) ? arg1 : arg0;

      const contractCall = getContractCall({
        provider,
        contractInfo,
        arg0,
        arg1,
        method,
        params,
        additionalArgs,
      });

      let shouldCallFallback = true;

      const handleFallback = async (resolve, reject, error) => {
        if (!shouldCallFallback) {
          return;
        }
        // prevent fallback from being called twice
        shouldCallFallback = false;

        const fallbackProvider = getFallbackProvider(chainId);
        if (!fallbackProvider) {
          reject(error);
          return;
        }

        const fallbackContractCall = getContractCall({
          provider: fallbackProvider,
          contractInfo,
          arg0,
          arg1,
          method,
          params,
          additionalArgs,
        });

        fallbackContractCall
          .then((result) => resolve(result))
          .catch((e) => {
            console.error("fallback fetcher error", id, contractInfo.contractName, method, e);
            reject(e);
          });
      };

      return new Promise(async (resolve, reject) => {
        contractCall
          .then((result) => {
            shouldCallFallback = false;
            resolve(result);
          })
          .catch((e) => {
            console.error("fetcher error", id, contractInfo.contractName, method, e);
            handleFallback(resolve, reject, e);
          });

        setTimeout(() => {
          handleFallback(resolve, reject, "contractCall timeout");
        }, 2000);
      });
    };

function getContractCall({ provider, contractInfo, arg0, arg1, method, params, additionalArgs }) {
  if (ethers.utils.isAddress(arg0)) {
    const address = arg0;
    const contract = new ethers.Contract(address, contractInfo, provider);

    if (additionalArgs) {
      return contract[method](...params.concat(additionalArgs));
    }
    return contract[method](...params);
  }

  if (!provider) {
    return;
  }

  return provider[method](arg1, ...params);
}

export const moralisCall = async (account: string) => {
  const nftAddresses = RAIJINS_NFTS.map((item) => item.address)

  const options: any = {
    method: 'GET',
    url: `https://deep-index.moralis.io/api/v2.2/${account}/nft`,
    params: { chain: 'Polygon', token_addresses: [...nftAddresses], format: 'decimal', normalizeMetadata: 'false' },
    headers: { accept: 'application/json', 'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjAyM2M2YzBmLWIxMmMtNDVjMS1iM2Q2LWU3ZTZmYzY1Y2JhYiIsIm9yZ0lkIjoiMzY3NzQzIiwidXNlcklkIjoiMzc3OTQ2IiwidHlwZUlkIjoiM2Y0ZDhkMDUtNjEwYi00ZjFiLWJlOWQtMzFiMTJmM2ZlNjdkIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDIyOTcyNDYsImV4cCI6NDg1ODA1NzI0Nn0.kvfJg_fPkcVcFkrDNkvfkG88pga6TqoXQlSsIjf4sXU' }
    // headers: {accept: 'application/json', 'X-API-Key': 'tKJraevH6KyOqIaGFdmL5aJDUxUcv0l60GWp4A4EXyQ8wSmUIg8Ql08HtLhYrOCr'}
  };

  const res = await axios.request(options)

  return res.data.result;
}

export const moralisFetcher =
  <T>(additionalArgs: any[]) =>
    (...args: any): Promise<T> => {

      const [account] = args[0];
      let shouldCallFallback = true;

      const handleFallback = async (resolve, reject, error) => {
        if (!shouldCallFallback) {
          return;
        }
        // prevent fallback from being called twice
        shouldCallFallback = false;

        await moralisCall(account)
          .then((result) => resolve(result))
          .catch((e) => {
            console.error("moralisFetcher fallback fetcher error", account, e);
            reject(e);
          });
      };

      return new Promise(async (resolve, reject) => {
        await moralisCall(account)
          .then((result) => {
            shouldCallFallback = false;
            resolve(result);
          })
          .catch((e) => {
            console.error("fetcher error", account, e);
            handleFallback(resolve, reject, e);
          });

        setTimeout(() => {
          handleFallback(resolve, reject, "moralisCall timeout");
        }, 10000);
      });
    };