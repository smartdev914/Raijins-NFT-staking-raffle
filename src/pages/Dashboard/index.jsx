import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";

import Layout from "components/Layout";
import DashboardContainer from "components/Dashboard/DashboardContainer";
import Content from "components/Dashboard/Content";
import ImageContainer from "components/Dashboard/ImageContainer";
import { useMediaQuery } from "@uidotdev/usehooks";
import "./index.scss";
import { useChainId } from "lib/chains";
import RaijinsTicket from "abis/RaijinsTicket.json";
import RaffleRaijins from "abis/RaffleRaijins.json";
import { getContract } from "config/contracts";
import { Raijins_RAFFLES } from "config/raffles";
import { contractFetcher } from "lib/contracts";
import {
  formatAmount,
} from "lib/numbers";

// ================================================
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
      },
      ticketCntForUser: parseInt(item.ticketCntForUser.toString())
    };
  });

  const finalArray = ret.filter((item) => item !== null);
  return finalArray;
};

const Dashboard = (props) => {
  const { connectWallet } = props;
  const isMobile = useMediaQuery("only screen and (max-width: 640px)");
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const ticketAddress = getContract(chainId, "RaijinsTicket");
  const raffleAddress = getContract(chainId, "RaffleRaijins");

  const { data: ticketBalance } = useSWR(
    active &&
    ticketAddress && [active, chainId, ticketAddress, "balanceOf", account],
    { fetcher: contractFetcher(library, RaijinsTicket) }
  );

  const { data: period } = useSWR(
    active && raffleAddress && [active, chainId, raffleAddress, "period"],
    { fetcher: contractFetcher(library, RaffleRaijins) }
  );

  const { data: waitingPeriod } = useSWR(
    active && raffleAddress && [active, chainId, raffleAddress, "waitingPeriod"],
    { fetcher: contractFetcher(library, RaffleRaijins) }
  );

  const { data: dataContract } = useSWR(
    active &&
    raffleAddress && [
      active,
      chainId,
      raffleAddress,
      "getRaffleInfo",
      account,
    ],
    { fetcher: contractFetcher(library, RaffleRaijins) }
  );
  let activeRaffles = loadActiveRaffles(dataContract, period, waitingPeriod);

  return (
    <Layout>
      <DashboardContainer>
        <Content
          connectWallet={connectWallet}
          isWalletConnected={active}
          isMobile={isMobile}
          raijinsTicketBalance={formatAmount(ticketBalance, 18, 0)}
          activeRaffles={activeRaffles}
        />
        {/* {isMobile ? null : <ImageContainer />} */}
      </DashboardContainer>
    </Layout>
  );
};

export default Dashboard;
