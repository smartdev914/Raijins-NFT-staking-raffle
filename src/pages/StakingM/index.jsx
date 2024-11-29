import { useWeb3React } from "@web3-react/core";

import Layout from "components/Layout";
import Hero from "components/Staking/Matic/HeroMatic";
import RaijinsStaking from "components/Staking/Matic/RaijinsStakingMatic";
import StakingContainer from "components/Staking/StakingContainer";
import StakingDesc from "components/Staking/StakingDesc";
import { useMediaQuery } from "@uidotdev/usehooks";

import "./index.scss";

// ================================================

const StakingM = (props) => {
  const { connectWallet } = props;

  const { active } = useWeb3React();
  const isMobile = useMediaQuery("only screen and (max-width: 640px)");

  return (
    <Layout>
      <StakingContainer>
        {!active ? (
          <>
            <Hero connectWallet={connectWallet} />
            <StakingDesc isMobile={isMobile} />
          </>
        ) : (
          <RaijinsStaking isMobile={isMobile} />
        )}
      </StakingContainer>
    </Layout>
  );
};

export default StakingM;
