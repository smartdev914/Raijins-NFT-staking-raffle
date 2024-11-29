import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import useSWR from "swr";

import Layout from "components/Layout";
import ActiveRaffles from "components/Raffles/ActiveRaffles";
import Hero from "components/Raffles/Hero";
import RafflesContainer from "components/Raffles/RafflesContainer";
import { useMediaQuery } from "@uidotdev/usehooks";
import "./index.scss";

import BuyRafflesModal from "components/Raffles/BuyRafflesModal";
import BuyRafflesWaitingModal from "components/Raffles/BuyRafflesWaitingModal";
import BuyRafflesCheckModal from "components/Raffles/BuyRafflesCheckModal";

import { useChainId } from "lib/chains";
import RaijinsTicket from "abis/RaijinsTicket.json";
import RaffleRaijins from "abis/RaffleRaijins.json";
import { getContract } from "config/contracts";
import { Raijins_RAFFLES } from "config/raffles";
import { callContract, contractFetcher } from "lib/contracts";
import { approveTokens } from "lib/approveTokens";
import {
  formatAmount,
} from "lib/numbers";
import { useLocation } from "react-router-dom";

//----------------------------------------------------------------------//
const { AddressZero } = ethers.constants;

const loadActiveRaffles = (dataContract, period, waitingPeriod) => {
  if (dataContract === undefined) return [];
  if (dataContract.length === 0) return [];

  if (period === undefined || period === 0) return [];
  if (waitingPeriod === undefined || waitingPeriod === 0) return [];

  const ret = dataContract.map((item, index) => {
    if (item.isDisabled) return null;

    const raffleInfo = Raijins_RAFFLES[index];
    let winningRate1x = 1 / (parseInt(item.totalTicketCnt.toString()) + 1) * 100;

    let winningRate = 0;
    if (parseInt(item.totalTicketCnt.toString()) === 0
     || parseInt(item.ticketCntForUser.toString()) === 0) 
      winningRate = 0;
    else {
      winningRate =
        (parseInt(item.ticketCntForUser.toString()) / parseInt(item.totalTicketCnt.toString())) * 100;
    }

    let days = 0;
    let hours = 0;
    let minutes = 0;
    const currentTime = new Date().getTime() / 1000;
    const endTime =
      parseInt(item.timeStarted.toString()) + parseInt(period.toString());

    let isEnded = false;
    if (currentTime >= endTime || item.isDecided)
      isEnded = true;
    else if (currentTime < endTime) {
      const timeToEnd = endTime - currentTime;
      days = Math.floor(timeToEnd / (60 * 60 * 24));
      hours = Math.floor((timeToEnd % (60 * 60 * 24)) / (60 * 60));
      minutes = Math.floor((timeToEnd % (60 * 60)) / 60);
    }

    let daysNext = 0;
    let hoursNext = 0;
    let minutesNext = 0;
    if (item.isDecided) {
      const nextRaffleTime = parseInt(item.timeDecided.toString()) + parseInt(waitingPeriod.toString());
      const timeToNextRaffle = nextRaffleTime - currentTime;
      if (currentTime < nextRaffleTime) {
        daysNext = Math.floor(timeToNextRaffle / (60 * 60 * 24));
        hoursNext = Math.floor((timeToNextRaffle % (60 * 60 * 24)) / (60 * 60));
        minutesNext = Math.floor((timeToNextRaffle % (60 * 60)) / 60);
      }
    }

    return {
      id: raffleInfo.id,
      image: raffleInfo.image,
      title: raffleInfo.title,
      value: item.value,
      winningRate1x: winningRate1x.toFixed(0),
      winningRate: winningRate.toFixed(0),
      winner: item.winner,
      ended: isEnded,
      decided: item.isDecided,
      remainingTime: {
        days: days,
        hours: hours,
        minutes: minutes,
      },
      remainingTimeNextRaffle: {
        days: daysNext,
        hours: hoursNext,
        minutes: minutesNext,
      }
    };
  });

  const finalArray = ret.filter((item) => item !== null);
  return finalArray;
};

const Raffles = (props) => {
  const { connectWallet, setPendingTxns } = props;
  const isMobile = useMediaQuery("only screen and (max-width: 640px)");

  const { pathname } = useLocation();
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const ticketAddress = getContract(chainId, "RaijinsTicket");
  const raffleAddress = getContract(chainId, "RaffleRaijins");

  const { data: ticketBalance } = useSWR(
    true &&
    ticketAddress && [true, chainId, ticketAddress, "balanceOf", active ? account : AddressZero],
    { fetcher: contractFetcher(library, RaijinsTicket) }
  );

  const { data: period } = useSWR(
    true && raffleAddress && [true, chainId, raffleAddress, "period"],
    { fetcher: contractFetcher(library, RaffleRaijins) }
  );

  const { data: waitingPeriod } = useSWR(
    true && raffleAddress && [true, chainId, raffleAddress, "waitingPeriod"],
    { fetcher: contractFetcher(library, RaffleRaijins) }
  );

  const { data: dataContract } = useSWR(
    true &&
    raffleAddress && [
      true,
      chainId,
      raffleAddress,
      "getRaffleInfo",
      active ? account : AddressZero,
    ],
    { fetcher: contractFetcher(library, RaffleRaijins) }
  );
  let activeRaffles = loadActiveRaffles(dataContract, period, waitingPeriod);

  const { data: approvedAmount } = useSWR(
    active &&
    ticketAddress && [
      active,
      chainId,
      ticketAddress,
      "allowance",
      account,
      raffleAddress,
    ],
    { fetcher: contractFetcher(library, RaijinsTicket) }
  );

  const [isApproving, setIsApproving] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [raijinsTicketsNum, setRaijinsTicketsNum] = useState(1);
  const [raffleIndex, setRaffleIndex] = useState(0);
  const [openBuyWaitingModal, setOpenBuyWaitingModal] = useState(false);
  const [openBuyCheckModal, setOpenBuyCheckModal] = useState(false);

  const needApproval = raijinsTicketsNum > parseInt(formatAmount(approvedAmount, 18));

  const onIncreaseBuyNumBtn = () => {
    const max = parseInt(formatAmount(ticketBalance, 18, 0));
    if (max === 0) {
      setRaijinsTicketsNum(0);
      return;
    }
    if (raijinsTicketsNum === max) return;
    setRaijinsTicketsNum((prevBuyNum) => prevBuyNum + 1);
  };

  const onDecreaseBuyNumBtn = () => {
    const max = parseInt(formatAmount(ticketBalance, 18, 0));
    if (max === 0) {
      setRaijinsTicketsNum(0);
      return;
    }
    if (raijinsTicketsNum === 1) return;
    setRaijinsTicketsNum((prevBuyNum) => prevBuyNum - 1);
  };

  const getTextForBtn = () => {
    if (needApproval && isWaitingForApproval) {
      return "Waiting for Approval...";
    }
    if (isApproving) {
      return "Approving";
    }
    if (needApproval) {
      return "Approve";
    }

    return "use raijins tickets";
  };

  const onBuyRaffleBtn = (raffleIndex) => {
    const max = parseInt(formatAmount(ticketBalance, 18, 0));
    if (max === 0)
      setRaijinsTicketsNum(0);
    else
      setRaijinsTicketsNum(1);
    setRaffleIndex(raffleIndex);
    setOpenBuyModal(true);
  };

  const approveRaijinsTicket = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        library,
        tokenAddress: ticketAddress,
        spender: raffleAddress,
        chainId: chainId,
        onApproveSubmitted: () => {
          setIsWaitingForApproval(true);
        },
      });

      return;
    }
  }

  const onUseRaijinsTicketsBtn = () => {
    if (needApproval) {
      approveRaijinsTicket();
      return;
    }

    setOpenBuyModal(false);

    const contract = new ethers.Contract(
      raffleAddress,
      RaffleRaijins,
      library.getSigner()
    );
    callContract(chainId, contract, "addTicket", [raffleIndex, raijinsTicketsNum], {
      setOpenActModal: setOpenBuyWaitingModal,
      setOpenActedModal: setOpenBuyCheckModal,
      setPendingTxns,
    })
      .then(async (res) => { })
      .finally(() => { });
  };

  useEffect(() => {
    if (needApproval) setIsWaitingForApproval(false);
  }, [needApproval, active]);

  useEffect(() => {
    // "document.documentElement.scrollTo" is the magic for React Router Dom v6
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Optional if you want to skip the scrolling animation
    });
  }, [pathname]);

  // useEffect(() => {
  //   if (raijinsTicketsNum > parseInt(formatAmount(approvedAmount, 18)))
  //     setNeedApproval(true);
  //   else
  //     setNeedApproval(false);
  // }, [raijinsTicketsNum]);

  return (
    <Layout>
      <RafflesContainer>
        <Hero
          isWalletConnected={active}
          connectWallet={connectWallet}
          raijinsTicketBalance={formatAmount(ticketBalance, 18, 0)}
          isMobile={isMobile}
        />
        <ActiveRaffles
          activeRaffles={activeRaffles}
          isWalletConnected={active}
          connectWallet={connectWallet}
          onBuyRaffleBtn={onBuyRaffleBtn}
        />
        <BuyRafflesModal
          openModal={openBuyModal}
          setOpenModal={setOpenBuyModal}
          onCloseModal={() => setOpenBuyModal(false)}
          raijinsTicketsNum={raijinsTicketsNum}
          raffleIndex={raffleIndex}
          raijinsTicketBalance={formatAmount(ticketBalance, 18, 0)}
          onIncreaseBuyNumBtn={onIncreaseBuyNumBtn}
          onDecreaseBuyNumBtn={onDecreaseBuyNumBtn}
          getTextForBtn={getTextForBtn}
          onUseRaijinsTicketsBtn={onUseRaijinsTicketsBtn}
          isMobile={isMobile}
        />
        <BuyRafflesWaitingModal
          openModal={openBuyWaitingModal}
          setOpenModal={setOpenBuyWaitingModal}
          onCloseModal={() => setOpenBuyWaitingModal(false)}
          isMobile={isMobile}
        />
        <BuyRafflesCheckModal
          openModal={openBuyCheckModal}
          setOpenModal={setOpenBuyCheckModal}
          onCloseModal={() => setOpenBuyCheckModal(false)}
          raijinsTicketsNum={raijinsTicketsNum}
          raffleIndex={raffleIndex}
          isMobile={isMobile}
        />
      </RafflesContainer>
    </Layout>
  );
};

export default Raffles;
