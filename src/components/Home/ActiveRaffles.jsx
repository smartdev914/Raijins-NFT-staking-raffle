import ActiveRafflesContainer from "./ActiveRafflesContainer";
import SectionTitle from "../SectionTitle";
import Description from "../Description";
import TopActiveRaffles from "./TopActiveRaffles";

// ================================================

const ActiveRaffles = ({ activeRaffles, isWalletConnected }) => {
  return (
    <ActiveRafflesContainer>
      <SectionTitle classes="mb-3">
        Active Raffles in the <span>Raijins</span>
      </SectionTitle>
      <Description classes="text-center mb-4">
        Here are the top raffles currently active.
        <br />
        Try your luck and win prizes
      </Description>
      <TopActiveRaffles activeRaffles={activeRaffles} isWalletConnected={isWalletConnected} />
    </ActiveRafflesContainer>
  );
};

export default ActiveRaffles;
