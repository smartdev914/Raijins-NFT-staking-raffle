// import { useWeb3React } from "@web3-react/core";

import GeneralStats from "./GeneralStats";
import ContentContainer from "./ContentContainer";
import SubtitleContainer from "./SubtitleContainer";

// ================================================

const Content = (props) => {
  const { connectWallet, isWalletConnected, isMobile, raijinsTicketBalance, activeRaffles } = props;

  return (
    <ContentContainer isMobile={isMobile}>
      {isWalletConnected ? (
        <GeneralStats
          isMobile={isMobile}
          raijinsTicketBalance={raijinsTicketBalance}
          activeRaffles={activeRaffles}
        />
      ) : (
        <SubtitleContainer connectWallet={connectWallet} />
      )}
    </ContentContainer>
  );
};

export default Content;
