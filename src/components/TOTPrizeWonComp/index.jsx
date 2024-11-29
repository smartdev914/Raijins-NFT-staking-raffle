import cx from "classnames";
import RaffleMATICImg from "assets/images/raffle/RaffleMATIC.png";
import "./index.scss";

// ================================================

const TOTPrizeWonComp = ({ wonTOTPrizesNum, variant, classes }) => {
  return (
    <div className={cx("tot-prizes-won-container", variant, classes)}>
      <h6 className={cx("mb-3")}>your Raijins tickets</h6>
      <div className={cx("d-flex")}>
        <img src={RaffleMATICImg} alt="RaffleMATIC.png" />
        <div className={cx("won-tot-prizes-num")}>
          <span>{wonTOTPrizesNum}</span>
          <br /> $matic
        </div>
      </div>
    </div>
  );
};

export default TOTPrizeWonComp;
