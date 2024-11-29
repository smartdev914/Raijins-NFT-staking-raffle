import cx from "classnames";
import PageTitle from "../PageTitle";
import Description from "../Description";
import RoundButton from "../RoundButton";
import SetNumComp from "../SetNumComp";
// import DangerKeepOutImg from "assets/images/earn/DangerKeepOut.png";
// import RaijinsTicketImgY from "assets/images/common/RaijinsTicketY.png";
// import RaijinsTicketImg from "assets/images/common/RaijinsTicket.png";
// import RaijinsTicketContainerTopBorderImg from "assets/images/earn/raijins-ticket-up-border.png";
// import RaijinsTicketContainerBottomBorderImg from "assets/images/earn/raijins-ticket-down-border.png";
import OwnedRaijinsTicketsComp from "../OwnedRaijinsTicketsComp";
import { useMediaQuery } from "@uidotdev/usehooks";
import metamask from "assets/images/MetaMask_Fox.svg";

// ================================================

const BuyRaijinsTickets = ({
  connectWallet,
  onPayBtn,
  isWalletConnected,
  onDecreaseBuyNumBtn,
  onIncreaseBuyNumBtn,
  buyNum,
  // ticketPrice,
  matics,
  raijinsTicketBalance,
  // setOpenBuyModal,
}) => {
  const isMobile = useMediaQuery("only screen and (max-width: 640px)");

  const addRaijinsTicket = async () => {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xd22bdF42215144Cf46F1725431002a5a388e3E6E",
          symbol: "RJT",
          decimals: "18",
          image: "",
        },
      },
    });
  };

  return (
    <div className={cx("buy-raijins")} id="buy-tickets">
      <PageTitle classes="buy-raijins-title">
        buy your <br />
        <span>raijins tickets</span>
      </PageTitle>

      {/* <div className={cx("raijins-ticket-container-sm")}>
        <div className={cx("raijins-ticket-wrapper")}>
          <img
            src={RaijinsTicketImg}
            id="RaijinsTicketImg"
            alt="raijins-ticket.png"
          />
          <span className={cx("raijins-ticket-img-container-price")}>=</span>
          <span className={cx("raijins-ticket-img-container-price")}>
            {ticketPrice}
          </span>
          <span className={cx("raijins-ticket-img-container-price")}>
            $MATIC
          </span>
        </div>
      </div> */}
      {isWalletConnected ? (
        <>
          <Description
            classes={cx(
              "text-center",
              isMobile ? "w-100" : "w-30",
              "mx-auto",
              "mb-3"
            )}
          >
            Ready to win prizes in the Raijins? Choose the amount of Raijins
            Tickets you would like to purchase below
          </Description>
          <SetNumComp
            onDecreaseBtn={onDecreaseBuyNumBtn}
            onIncreaseBtn={onIncreaseBuyNumBtn}
            num={buyNum}
          />
          <div className={cx("matics-for-purchase")}>{matics} $matic</div>
          <div className={cx("text-center", "mb-5")}>
            <RoundButton variant="danger" text="pay" onBtnClick={onPayBtn} />
          </div>
          <div className={cx("d-flex", "justify-center")}>
            <OwnedRaijinsTicketsComp
              raijinsTicketBalance={raijinsTicketBalance}
              variant={isMobile ? "primary" : "light"}
            />
          </div>
          <div className={cx("d-flex", "justify-center")}>
            <div className={cx("add-btn")} onClick={() => addRaijinsTicket()}>
              <img
                className="add-image"
                src={metamask}
                alt="MetaMask"
                width={60}
              ></img>
              <div className="add-text">Add Raijins TICKET</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Description
            classes={cx(
              "text-center",
              isMobile ? "w-100" : "w-30",
              "mx-auto",
              "mb-3"
            )}
          >
            Connect your wallet to buy Raijins Tickets
          </Description>
          {/* <div className={cx("text-center", "mb-6")}>
            <img src={DangerKeepOutImg} alt="danger-keepout.png" width={60} />
          </div> */}
          <div className={cx("text-center")}>
            <RoundButton
              variant="danger"
              text="connect wallet"
              onBtnClick={connectWallet}
            />
          </div>
        </>
      )}
      {/* <div className={cx("raijins-ticket-container")}>
        <div className={cx("raijins-ticket-wrapper")}>
          <img
            src={RaijinsTicketContainerTopBorderImg}
            id="RaijinsTicketContainerTopBorderImg"
          />
          <img
            src={RaijinsTicketImgY}
            id="RaijinsTicketImgY"
            alt="raijins-ticket.png"
          />
          <span className={cx("raijins-ticket-img-container-price")}>=</span>
          <span className={cx("raijins-ticket-img-container-price")}>
            {ticketPrice}
          </span>
          <span className={cx("raijins-ticket-img-container-price")}>
            $MATIC
          </span>
          <img
            src={RaijinsTicketContainerBottomBorderImg}
            id="RaijinsTicketContainerBottomBorderImg"
          />
        </div>
      </div> */}
    </div>
  );
};

export default BuyRaijinsTickets;
