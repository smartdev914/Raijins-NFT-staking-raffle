import { useWeb3React } from "@web3-react/core";
import AddressDropdown from "../AddressDropdown/AddressDropdown";
import RoundButton from "../RoundButton";
import React, { useCallback, useEffect } from "react";

import "./Header.scss";
import { getAccountUrl } from "lib/legacy";
import { POLYGON, getChainName } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";

type Props = {
  openSettings: () => void;
  small?: boolean;
  setWalletModalVisible: (visible: boolean) => void;
  disconnectAccountAndCloseSettings: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
  mode: string;
  onSetModeBtn: () => void;
};

export function AppHeaderUser({
  openSettings,
  small,
  setWalletModalVisible,
  disconnectAccountAndCloseSettings,
  redirectPopupTimestamp,
  showRedirectModal,
  mode,
  onSetModeBtn,
}: Props) {
  const { chainId } = useChainId();
  const { active, account } = useWeb3React();

  useEffect(() => {
    if (active) {
      setWalletModalVisible(false);
    }
  }, [active, setWalletModalVisible]);

  if (!active) {
    return (
      <div className="App-header-user">
        <RoundButton
          text="connect"
          variant="transparent"
          onBtnClick={() => setWalletModalVisible(true)}
        />
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  return (
    <div className="App-header-user">
      <div className="App-header-user-address">
        <AddressDropdown
          account={account}
          accountUrl={accountUrl}
          disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
        />
      </div>
    </div>
  );
}
