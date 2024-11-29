import cx from "classnames";
import Description from "components/Description";
import RoundButton from "components/RoundButton";
// import { toggleConnect } from "lib/store/walletSlice";

// ================================================

const SubtitleContainer = (props) => {
  const { connectWallet } = props;

  return (
    <div className={cx("subtitle-container")}>
      <Description classes={cx("text-center", "mb-3", "w-70", "mx-auto")}>
        Connect your wallet to check your activities (including Raijins Tickets
        balance and raffles activities)
      </Description>
      <div className="text-center">
        <RoundButton
          text="connect wallet"
          variant="primary"
          onBtnClick={connectWallet}
        />
      </div>
    </div>
  );
};

export default SubtitleContainer;
