import { ethers } from "ethers";
import Token from "abis/RaijinsTicket.json";
import { getExplorerUrl } from "config/chains";
import { helperToast } from "lib/helperToast";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import ExternalLink from "components/ExternalLink/ExternalLink";

type Params = {
  setIsApproving: (val: boolean) => void;
  library: Web3ReactContextInterface["library"];
  tokenAddress: string;
  spender: string;
  chainId: number;
  onApproveSubmitted: () => void;
  pendingTxns: any[];
  setPendingTxns: (txns: any[]) => void;
  includeMessage?: boolean;
};

export function approveTokens({
  setIsApproving,
  library,
  tokenAddress,
  spender,
  chainId,
  onApproveSubmitted,
  pendingTxns,
  setPendingTxns,
  includeMessage,
}: Params) {
  setIsApproving(true);
  const contract = new ethers.Contract(tokenAddress, Token, library.getSigner());
  contract
    .approve(spender, ethers.constants.MaxUint256)
    .then(async (res) => {
      const txUrl = getExplorerUrl(chainId) + "tx/" + res.hash;
      helperToast.success(
        <div>
          Approval submitted! <ExternalLink href={txUrl}>View status.</ExternalLink>
          <br />
        </div>
      );
      if (onApproveSubmitted) {
        onApproveSubmitted();
      }
      if (pendingTxns && setPendingTxns) {
        const pendingTxn = {
          hash: res.hash,
          message: includeMessage ? `Raijins Ticket Approved!` : false,
        };
        setPendingTxns([...pendingTxns, pendingTxn]);
      }
    })
    .catch((e) => {
      console.error(e);
      let failMsg;
      if (
        ["not enough funds for gas", "failed to execute call with revert code InsufficientGasFunds"].includes(
          e.data?.message
        )
      ) {
        failMsg = (
          <div>
            There is not enough MATIC in your account on Polygon to send this transaction.
            <br />
            <br />
            <ExternalLink href="https://www.mexc.com/">Bridge MATIC to Polygon</ExternalLink>
          </div>
        );
      } else if (e.message?.includes("User denied transaction signature")) {
        failMsg = `Approval was cancelled`;
      } else {
        failMsg = `Approval failed`;
      }
      helperToast.error(failMsg);
    })
    .finally(() => {
      setIsApproving(false);
    });
}
