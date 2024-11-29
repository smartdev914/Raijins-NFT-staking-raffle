import Description from "components/Description";
import PageTitle from "components/PageTitle";
// import { toggleConnect } from "lib/store/walletSlice";
import RoundButton from "../RoundButton";
import cx from "classnames";
import OwnedRaijinsTicketsComp from "../OwnedRaijinsTicketsComp";

// ================================================

const Hero = (props) => {
  const { isWalletConnected, connectWallet, raijinsTicketBalance, isMobile } =
    props;

  return (
    <div className={cx("mb-4")}>
      <PageTitle classes={cx("mb-3")}>
        active <span>raffles</span>
      </PageTitle>
      <Description classes={cx("text-center")}>
        Here are the currently active raffles.
      </Description>
      <Description classes={cx("text-center mb-3")}>
        Try your luck and win your prizes!
      </Description>
      {isWalletConnected ? (
        <div
          className={cx("d-flex", isMobile ? "justify-center" : "justify-end")}
        >
          {/* <OwnedRaijinsTicketsComp
            raijinsTicketBalance={raijinsTicketBalance}
            variant="dark"
          /> */}
        </div>
      ) : (
        <div className={cx("d-flex", "justify-center")}>
          <RoundButton
            text="connect wallet"
            variant="primary"
            // classes={isMobile ? "w-80" : "w-60"}
            onBtnClick={connectWallet}
          />
        </div>
      )}
    </div>
  );
};

export default Hero;
