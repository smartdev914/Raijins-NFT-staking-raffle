import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { SWRConfig } from "swr";
// import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// import { RiMenuLine } from "react-icons/ri";
// import { FaTimes } from "react-icons/fa";
// import { AnimatePresence as FramerAnimatePresence, motion } from "framer-motion";

import "./App.scss";

import {
  CURRENT_PROVIDER_LOCALSTORAGE_KEY,
  // DISABLE_ORDER_VALIDATION_KEY,
  // IS_PNL_IN_LEVERAGE_KEY,
  // LANGUAGE_LOCALSTORAGE_KEY,
  // REFERRAL_CODE_KEY,
  SHOULD_EAGER_CONNECT_LOCALSTORAGE_KEY,
  // SHOULD_SHOW_POSITION_LINES_KEY,
  // SHOW_PNL_AFTER_FEES_KEY,
  // SLIPPAGE_BPS_KEY,
} from "config/localStorage";

import { getExplorerUrl } from "config/chains";

import {
  // BASIS_POINTS_DIVISOR,
  // getAppBaseUrl,
  // isHomeSite,
  isMobileDevice,
} from "lib/legacy";

import Modal from "components/Modal/Modal";
import SEO from "components/Common/SEO";

import metamaskImg from "assets/images/metamask.png";
// import defiwalletImg from "assets/images/cryptocom.png"
import coinbaseImg from "assets/images/coinbaseWallet.png";
import walletConnectImg from "assets/images/walletconnect-circle-blue.svg";

import { helperToast } from "lib/helperToast";
import {
  activateInjectedProvider,
  clearWalletConnectData,
  clearWalletLinkData,
  getInjectedHandler,
  getInjectedHandlerDeFiWallet,
  getWalletConnectV2Handler,
  hasCoinBaseWalletExtension,
  hasMetaMaskWalletExtension,
  useEagerConnect,
  useInactiveListener,
} from "lib/wallets";
import { useChainId } from "lib/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";
import Header from "components/Header/Header";
import { cssTransition, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = React.lazy(() => import("pages/Home"));
const About = React.lazy(() => import("pages/About"));
const EarnRaijinsTickets = React.lazy(() => import("pages/EarnRaijinsTickets"));
const Staking = React.lazy(() => import("pages/Staking"));
const StakingM = React.lazy(() => import("pages/StakingM"));
const Raffles = React.lazy(() => import("pages/Raffles"));
const Dashboard = React.lazy(() => import("pages/Dashboard"));

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  return library;
}

const Zoom = cssTransition({
  enter: "zoomIn",
  exit: "zoomOut",
  appendPosition: false,
  collapse: true,
  collapseDuration: 200,
  duration: 200,
});

function FullApp() {

  const { connector, library, deactivate, activate } = useWeb3React();
  const { chainId } = useChainId();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector, chainId]);
  const triedEager = useEagerConnect(setActivatingConnector);
  useInactiveListener(!triedEager || !!activatingConnector);

  const userOnMobileDevice = "navigator" in window && isMobileDevice(window.navigator);

  // const navigate = useNavigate();
  
  const connectInjectedWallet = getInjectedHandler(activate);
  const connectInjectedDeFiWallet = getInjectedHandlerDeFiWallet(activate);

  const connectWallet = () => setWalletModalVisible(true);

  const disconnectAccount = useCallback(() => {
    // only works with WalletConnect
    clearWalletConnectData();
    // force clear localStorage connection for MM/CB Wallet (Brave legacy)
    clearWalletLinkData();
    deactivate();
  }, [deactivate])

  const disconnectAccountAndCloseSettings = () => {
    disconnectAccount();
    localStorage.removeItem(SHOULD_EAGER_CONNECT_LOCALSTORAGE_KEY);
    localStorage.removeItem(CURRENT_PROVIDER_LOCALSTORAGE_KEY);
  };

  const attemptActivateWallet = (providerName) => {
    localStorage.setItem(SHOULD_EAGER_CONNECT_LOCALSTORAGE_KEY, true);
    localStorage.setItem(CURRENT_PROVIDER_LOCALSTORAGE_KEY, providerName);
    activateInjectedProvider(providerName);
    providerName === "DeFiWallet" ? connectInjectedDeFiWallet() : connectInjectedWallet();
  };

  const activateMetaMask = () => {
    if (!hasMetaMaskWalletExtension()) {
      helperToast.error(
        <div>
          MetaMask not detected.
          <br />
          <br />
          {userOnMobileDevice ? (
            <>
              <ExternalLink href="https://metamask.io">Install MetaMask</ExternalLink>", and use Raijins with its built-in browser"
            </>
          ) : (
            <>
              <ExternalLink href="https://metamask.io">Install MetaMask</ExternalLink>" to start using Raijins"
            </>
          )}
        </div>
      );
      return false;
    }
    attemptActivateWallet("MetaMask");
  };

  // const activateDeFi = () => {
  //   attemptActivateWallet("DeFiWallet");
  // };

  const activateCoinBase = () => {
    if (!hasCoinBaseWalletExtension()) {
      helperToast.error(
        <div>
          Coinbase Wallet not detected.
          <br />
          <br />
          {userOnMobileDevice ? (
            <>
              <ExternalLink href="https://www.coinbase.com/wallet">Install Coinbase Wallet</ExternalLink>", and use Raijins with its built-in browser"
            </>
          ) : (
            <>
              <ExternalLink href="https://www.coinbase.com/wallet">Install Coinbase Wallet</ExternalLink>" to start using Raijins"
            </>
          )}
        </div>
      );
      return false;
    }
    attemptActivateWallet("CoinBase");
  };

  const activateWalletConnectV2 = () => {
    getWalletConnectV2Handler(activate, deactivate, setActivatingConnector)();
  };


  const [pendingTxns, setPendingTxns] = useState([]);

  useEffect(() => {
    const checkPendingTxns = async () => {
      const updatedPendingTxns = [];
      for (let i = 0; i < pendingTxns.length; i++) {
        const pendingTxn = pendingTxns[i];
        const receipt = await library.getTransactionReceipt(pendingTxn.hash);
        if (receipt) {
          if (receipt.status === 0) {
            const txUrl = getExplorerUrl(chainId) + "tx/" + pendingTxn.hash;
            helperToast.error(
              <div>
                Txn failed. <ExternalLink href={txUrl}>View</ExternalLink>
                <br />
              </div>
            );
          }
          if (receipt.status === 1) {
            if (pendingTxn.act && pendingTxn.acted) {
              pendingTxn.act(false);
              pendingTxn.acted(true);
            } else if (pendingTxn.message) {
              const txUrl = getExplorerUrl(chainId) + "tx/" + pendingTxn.hash;
              helperToast.success(
                <div>
                  {pendingTxn.message}{" "}
                  <ExternalLink href={txUrl}>
                    View
                  </ExternalLink>
                  <br />
                </div>
              );
            }
          }
          continue;
        }
        updatedPendingTxns.push(pendingTxn);
      }

      if (updatedPendingTxns.length !== pendingTxns.length) {
        setPendingTxns(updatedPendingTxns);
      }
    };

    const interval = setInterval(() => {
      checkPendingTxns();
    }, 2 * 1000);
    return () => clearInterval(interval);
  }, [library, pendingTxns, chainId]);

  return (
    <>
      <Header
        disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
        setWalletModalVisible={setWalletModalVisible}
      />
      <Suspense>
        <Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route path="/faq" element={
            <About />
          } />
          <Route path="/earn-raijins-tickets" element={
            <EarnRaijinsTickets
              connectWallet={connectWallet}
              setPendingTxns={setPendingTxns}
            />
          } />
          <Route path="/staking-for-ticket" element={
            <Staking
              connectWallet={connectWallet}
            />
          } />
          <Route path="/staking-for-matic" element={
            <StakingM
              connectWallet={connectWallet}
            />
          } />
          <Route path="/raffles" element={
            <Raffles
              connectWallet={connectWallet}
              setPendingTxns={setPendingTxns}
            />
          } />
          <Route path="/dashboard" element={
            <Dashboard
              connectWallet={connectWallet}
            />
          } />
        </Routes>
      </Suspense>
      <ToastContainer
        limit={1}
        transition={Zoom}
        position="bottom-right"
        autoClose={7000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        draggable={false}
        pauseOnHover
      />
      <Modal
        className="Connect-wallet-modal"
        isVisible={walletModalVisible}
        setIsVisible={setWalletModalVisible}
        label={"Connect Wallet"}
      >
        <button className="Wallet-btn MetaMask-btn" onClick={activateMetaMask}>
          <img src={metamaskImg} alt="MetaMask" />
          <div>
            MetaMask
          </div>
        </button>
        <button className="Wallet-btn CoinbaseWallet-btn" onClick={activateCoinBase}>
          <img src={coinbaseImg} alt="Coinbase Wallet" />
          <div>
            Coinbase Wallet
          </div>
        </button>
        <button className="Wallet-btn WalletConnect-btn" onClick={activateWalletConnectV2}>
          <img src={walletConnectImg} alt="WalletConnect" />
          <div>
            WalletConnect
          </div>
        </button>
      </Modal>
    </>
  );
}

function App() {
  return (
    <SWRConfig value={{ refreshInterval: 10000 }}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <SEO>
          <BrowserRouter>
            <FullApp />
          </BrowserRouter>
        </SEO>
      </Web3ReactProvider>
    </SWRConfig>
  );
}

export default App;
// ------------------------------------------------
