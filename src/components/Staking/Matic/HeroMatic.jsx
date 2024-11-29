import cx from "classnames";
import Description from "../../Description";
import PageTitle from "../../PageTitle";
import RoundButton from "../../RoundButton";

// import VitaImg from "assets/images/staking/Vita.png";
// import ScrollButton from "components/ScrollButton";

const Hero = (props) => {
  const { connectWallet } = props;

  return (
    <div className={cx("staking-hero")}>
      <div className={cx("page-intro")}>
        <PageTitle>
          Raijins staking for <span>$MATIC</span>
        </PageTitle>
        <Description>
          Connect your wallet to start staking your Raijins NFTs.
        </Description>
        <Description>For more information, scroll down</Description>
        <RoundButton
          variant="primary"
          text="connect wallet"
          onBtnClick={connectWallet}
        />
      </div>
      {/* <div className={cx("hero-img-container")}>
        <img src={VitaImg} alt="vita.png" width="80%" />
      </div> */}
      {/* <div className={cx("scrollbtn-wrapper")}>
        <ScrollButton />
      </div> */}
    </div>
  );
};

export default Hero;
