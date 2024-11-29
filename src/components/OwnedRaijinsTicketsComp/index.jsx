import cx from "classnames";
// import RaijinsTicketImg from "assets/images/common/RaijinsTicket.png";
import "./index.scss";

// ================================================

const OwnedRaijinsTicketsComp = ({ raijinsTicketBalance, variant, classes }) => {
  return (
    <div className={cx("owned-raijins-tickets-container", variant, classes)}>
      <h6 className={cx("mb-3")}>your Raijins tickets: <span>{raijinsTicketBalance}</span></h6>
      {/* <div className={cx("d-flex", "align-center")}>
        <img src={RaijinsTicketImg} alt="RaijinsTicket.png" />
        <div className={cx("owned-raijins-tickets-num")}>
          <span>{raijinsTicketBalance}</span>
          <br /> owned
        </div>
      </div> */}
    </div>
  );
};

export default OwnedRaijinsTicketsComp;
