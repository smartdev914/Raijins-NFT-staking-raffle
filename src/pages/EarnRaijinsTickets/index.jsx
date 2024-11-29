import { useState } from "react";
import EarnRaijinsTicketsContainer from "components/EarnRaijinsTickets/EarnRaijinsTicketsContainer";
import Layout from "components/Layout";
import HowToEarn from "components/EarnRaijinsTickets/HowToEarn";
import BuyRaijinsTickets from "components/EarnRaijinsTickets/BuyRaijinsTickets";
import BuyRaijinsTicketsModal from "components/EarnRaijinsTickets/BuyRaijinsTicketsModal";
import "./index.scss";

import Method1Img from "assets/images/earn/method1.png";
import Method2Img from "assets/images/earn/method2.png";
import Method3Img from "assets/images/earn/method3.png";
import Method4Img from "assets/images/earn/method4.png";
import BoughtRaijinsTicketsModal from "components/EarnRaijinsTickets/BoughtRaijinsTicketsModal";

import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useChainId } from "lib/chains";
import RaijinsTicketRouter from "abis/RaijinsTicketRouter.json";
import RaijinsTicket from "abis/RaijinsTicket.json";
import { getContract } from "config/contracts";
import { callContract, contractFetcher } from "lib/contracts";
import {
  formatAmount,
  parseValue,
} from "lib/numbers";

// ================================================

const earnRaijinsTicketCardContents = [
  {
    id: "staking",
    image: Method1Img,
    title: "staking",
    desc: "Staking Raijins NFTs is the easiest way to earn Raijins Tickets. Once staked, each Raijins NFT will award you with Raijins Tickets.",
    actionText: "stake",
  },
  {
    id: "buy",
    image: Method2Img,
    title: "buy with $MATIC",
    desc: "Buy Raijins Tickets directly with $MATIC <br/><br/> 1 Raijins Ticket = $0.35 \n (paid in $MATIC equivalent)",
    actionText: "buy",
  },
  {
    id: "join",
    image: Method3Img,
    title: "join events",
    desc: "Be active on the Raijins Discord and Twitter is another way for you to earn Raijins Tickets! We host recurring events and contests where you can earn Raijins Tickets",
    actionText: "join discord",
  },
  {
    id: "redacted",
    image: Method4Img,
    title: "[redacted]",
    desc: "[TO BE RELEASED IN PHASE 2]",
    actionText: "coming soon",
  },
];

// ================================================

const EarnRaijinsTickets = (props) => {
  const { connectWallet, setPendingTxns } = props;

  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const [buyNum, setBuyNum] = useState(1);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openBoughtModal, setOpenBoughtModal] = useState(false);

  const ticketAddress = getContract(chainId, "RaijinsTicket");
  const routerAddress = getContract(chainId, "RaijinsTicketRouter");

  const { data: maticPrice } = useSWR(
    true &&
      routerAddress && [true, chainId, routerAddress, "getLatestMATICPrice"],
    { fetcher: contractFetcher(library, RaijinsTicketRouter) }
  );

  const { data: ticketPriceUSD } = useSWR(
    true &&
      routerAddress && [true, chainId, routerAddress, "raijinsTicketPrice_USD"],
    { fetcher: contractFetcher(library, RaijinsTicketRouter) }
  );

  const { data: ticketBalance } = useSWR(
    active &&
      ticketAddress && [active, chainId, ticketAddress, "balanceOf", account],
    { fetcher: contractFetcher(library, RaijinsTicket) }
  );

  let ticketPirceByMATIC = 0;
  let maticAmount = 0;

  if (maticPrice !== undefined && ticketPriceUSD !== undefined) {
    ticketPirceByMATIC = (
      formatAmount(ticketPriceUSD, 8, 8) / formatAmount(maticPrice, 8, 8)
    ).toFixed(2);
    maticAmount = (ticketPirceByMATIC * buyNum).toFixed(2);
  }

  const onPay = () => {
    const contract = new ethers.Contract(
      routerAddress,
      RaijinsTicketRouter,
      library.getSigner()
    );
    callContract(chainId, contract, "buyRaijinsTicketsByMATIC", [], {
      value: parseValue(maticAmount, 18),
      setOpenActModal: setOpenBuyModal,
      setOpenActedModal: setOpenBoughtModal,
      setPendingTxns,
    })
      .then(async (res) => {})
      .finally(() => {});
  };

  const onIncreaseBuyNumBtn = () => {
    if (buyNum === 1000) return;
    setBuyNum((prevBuyNum) => prevBuyNum + 1);
  };

  const onDecreaseBuyNumBtn = () => {
    if (buyNum === 1) return;
    setBuyNum((prevBuyNum) => prevBuyNum - 1);
  };

  // ------------------------------------------------

  return (
    <Layout>
      <EarnRaijinsTicketsContainer>
        <HowToEarn
          earnRaijinsTicketCardContents={earnRaijinsTicketCardContents}
        />
        <BuyRaijinsTickets
          connectWallet={connectWallet}
          onPayBtn={onPay}
          isWalletConnected={active}
          onIncreaseBuyNumBtn={onIncreaseBuyNumBtn}
          onDecreaseBuyNumBtn={onDecreaseBuyNumBtn}
          buyNum={buyNum}
          ticketPrice={ticketPirceByMATIC}
          matics={maticAmount}
          raijinsTicketBalance={formatAmount(ticketBalance, 18, 0)}
          setOpenBuyModal={setOpenBuyModal}
        />
        <BuyRaijinsTicketsModal
          openModal={openBuyModal}
          setOpenModal={setOpenBuyModal}
          onCloseModal={() => setOpenBuyModal(false)}
        />
        <BoughtRaijinsTicketsModal
          openModal={openBoughtModal}
          setOpenModal={setOpenBoughtModal}
          onCloseModal={() => setOpenBoughtModal(false)}
          buyNum={buyNum}
        />
      </EarnRaijinsTicketsContainer>
    </Layout>
  );
};

export default EarnRaijinsTickets;
