import Layout from "components/Layout";
import AboutContainer from "components/About/AboutContainer";
import PageTitle from "components/PageTitle";
import RaijinsAccordion from "components/RaijinsAccordion";
import "./index.scss";

// ================================================

const faqs = [
  {
    id: 0,
    topic: "Raijins wtf?",
    desc: "Raijins is more than just a project, we are a community destined to shape the future of this ecosystem.",
  },
  {
    id: 1,
    topic: "what is a raijins ticket and what can I do with it?",
    desc: "Raijins Tickets are passes to enter the Raijins’s raffles. If you stake your Raijins NFTs, you will earn Raijins Tickets, which you can then use to participate in exclusive raffles. Raijins Tickets utilization is expected to evolve drastically with the release of Phase 2 of the Raijins. Raijins Tickets are also purchasable in $MATIC <a href='https://raijins.bluespade.xyz/earn-raijins-tickets' target='_self'>here</a>",
  },
  {
    id: 2,
    topic: "how do I earn raijins tickets?",
    desc: "There are four ways to earn Raijins Tickets: 1. STAKING Raijins NFTS, 2. BUYING WITH $MATIC, 3. JOINING EVENTS, 4.	[REDACTED 👀]<br /><br />STAKING Raijins NFTS<br/> Staking Raijins NFTs is the easiest way to earn Raijins Tickets. Once staked, every Volume and Avatar will generate Raijins Tickets. Amount of Raijins Tickets gained will change based on the staking period length and type of Raijins NFT staked. For further details on staking, read <a href='https://raijins.bluespade.xyz/staking' target='_self'>here</a>. <br /> <br/> BUYING WITH $MATIC<br/>You are able to buy directly Raijins Tickets with $MATIC. 1 Raijins Ticket = $0.35 (in $MATIC equivalent). You can buy your Raijins Ticket from <a href='https://raijins.bluespade.xyz/earn-raijins-tickets' target='_self'>here</a>.<br/><br/>JOINING EVENTS<br/>Being active on Discord and Twitter is another way for you to earn Raijins Tickets! We host recurring events and contests where you can earn Raijins Tickets.",
  },
  {
    id: 3,
    topic: "what is a Raijins's raffle?",
    desc: "Periodically, we will host in the Raijins multiple raffles. Each raffle contains exclusive prizes. You can participate in your favorite raffle by utilizing your Raijins Tickets. The more Raijins Tickets spent on a raffle, the higher the chance of winning! You can found active raffles in <a href='https://raijins.bluespade.xyz/raffles' target='_self'>here</a>.",
  },
  {
    id: 4,
    topic: "how do I stake my raijins NFTs?",
    desc: "Go to <a href='https://raijins.bluespade.xyz/staking' target='_self'>https://raijins.bluespade.xyz/staking</a>, connect your wallet, choose the Raijins NFT(s) you want to stake and the length of the staking period. Amount of Raijins Tickets gained will change based on the staking period length and the type of Raijins NFT staked.",
  },
  {
    id: 5,
    topic: "when staking rewards are paid?",
    desc: "Raijins Tickets are awarded at the end of each staking period. Awarded Raijins Tickets can be claimed at anytime by: 1) Pressing the “CLAIM REWARDS” button or 2) Pressing the “UNSTAKE” button - this allows you to claim your awarded Raijins Tickets + unstake your Raijins NFTs. Unstaking can be done at any moment; however, any pending reward will be automatically forfeit if the staking period has not been completed.",
  },
  {
    id: 6,
    topic: "Raijins - phase 2?",
    desc: "Due to technical complexities, the Raijins protocol is being developed in two separate phases. What to expect for Phase 2? Phase 2 will primarily revolve around upgrading the Raijins Tickets’ utilization system. SACRIFICE and RESCUE mechanisms will be implemented and fully integrated within the Raijins Tickets’ ecosystem. To avoid copy-cats, we will be releasing more information on SACRIFICE and RESCUE mechanisms closer to Phase 2’s release.",
  },
  {
    id: 7,
    topic: "will I lose my raijins tickets post phase 2 migration?",
    desc: "No, Raijins Tickets’ holdings will be passed to Phase 2. If you are not interested in any ongoing raffles, you can keep accumulating your Raijins Tickets and utilize them once Phase 2 is deployed.",
  },
  {
    id: 8,
    topic: "“1X TICKET WINNING RATE” AND “YOUR WINNING RATE” EXPLAINED",
    desc: "Every raffle showcases two winning rates: “1X TICKET WINNING RATE” AND “YOUR WINNING RATE”.<br/><br/>“1X TICKET WINNING RATE” = winning probability of a new Raijins Ticket invested in a specific raffle<br/>“YOUR WINNING RATE” = user's current winning probability based on the total number of Raijins Tickets currently invested in a specific raffle",
  },
];

// ================================================

const About = () => {
  return (
    <Layout>
      <AboutContainer>
        <PageTitle classes="about-title">
          what the bluespade is the <span>Raijins</span>?
        </PageTitle>
        <RaijinsAccordion contents={faqs} />
      </AboutContainer>
    </Layout>
  );
};

export default About;
