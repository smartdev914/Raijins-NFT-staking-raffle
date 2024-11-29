import { BigNumber, Contract } from "ethers";
import { helperToast } from "../helperToast";
import { ToastifyDebug } from "components/ToastifyDebug/ToastifyDebug";
import { extractError, NOT_ENOUGH_FUNDS, RPC_ERROR, SLIPPAGE, USER_DENIED } from "./transactionErrors";
import { getGasLimit, setGasPrice } from "./utils";
import { getExplorerUrl } from "config/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";

export async function callContract(
  chainId: number,
  contract: Contract,
  method: string,
  params: any,
  opts: {
    value?: BigNumber | number;
    gasLimit?: BigNumber | number;
    sentMsg?: string;
    successMsg?: string;
    hideSuccessMsg?: boolean;
    failMsg?: string;
    setPendingTxns?: (txns: any) => void;
    setOpenActModal?: (visible: boolean) => void;
    setOpenActedModal?: (visible: boolean) => void;
  }
) {
  try {
    if (!Array.isArray(params) && typeof params === "object" && opts === undefined) {
      opts = params;
      params = [];
    }

    if (!opts) {
      opts = {};
    }

    const txnOpts: any = {};

    if (opts.value) {
      txnOpts.value = opts.value;
    }

    txnOpts.gasLimit = opts.gasLimit ? opts.gasLimit : await getGasLimit(contract, method, params, opts.value);
    await setGasPrice(txnOpts, contract.provider, chainId);

    const res = await contract[method](...params, txnOpts);
    const txUrl = getExplorerUrl(chainId) + "tx/" + res.hash;
    const sentMsg = opts.sentMsg;

    if (sentMsg) {
      helperToast.success(
        <div>
          {sentMsg}{" "}
          <ExternalLink href={txUrl}>
            View status.
          </ExternalLink>
          <br />
        </div>
      );
    }

    if (opts.setOpenActModal)
      opts.setOpenActModal(true);

    if (opts.setPendingTxns) {
      if (opts.setOpenActModal && opts.setOpenActedModal) {
        const pendingTxn = {
          hash: res.hash,
          act: opts.setOpenActModal,
          acted: opts.setOpenActedModal,
        };
        opts.setPendingTxns((pendingTxns) => [...pendingTxns, pendingTxn]);
      } else {
        const message = opts.hideSuccessMsg ? undefined : opts.successMsg || "Transaction completed!";
        const pendingTxn = {
          hash: res.hash,
          message,
        };
        opts.setPendingTxns((pendingTxns) => [...pendingTxns, pendingTxn]);
      }
    }

    return res;
  } catch (e) {
    let failMsg;

    let autoCloseToast: number | boolean = 5000;

    const [message, type, errorData] = extractError(e);
    switch (type) {
      case NOT_ENOUGH_FUNDS:
        failMsg = (
          <div>
            There is not enough MATIC in your account on Polygon to send this transaction.
            <br />
            <br />
            <ExternalLink href="https://Polygon.org/">Bridge MATIC to Polygon</ExternalLink>
          </div>
        );
        break;
      case USER_DENIED:
        failMsg = "Transaction was cancelled.";
        break;
      case SLIPPAGE:
        failMsg = "The mark price has changed, consider increasing your Allowed Slippage by clicking on the ... icon next to your address.";
        break;
      case RPC_ERROR:
        autoCloseToast = false;

        const originalError = errorData?.error?.message || errorData?.message || message;

        failMsg = (
          <div>
            Transaction failed due to RPC error.
            <br />
            <br />
            Please try changing the RPC url in your wallet settings.{" "}
            <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#backup-rpc-urls">More info</ExternalLink>
            <br />
            {originalError && <ToastifyDebug>{originalError}</ToastifyDebug>}
          </div>
        );
        break;
      default:
        autoCloseToast = false;

        failMsg = (
          <div>
            {opts.failMsg || "Transaction failed"}
            <br />
            {message && <ToastifyDebug>{message}</ToastifyDebug>}
          </div>
        );
    }

    helperToast.error(failMsg, { autoClose: autoCloseToast });
    throw e;
  }
}
