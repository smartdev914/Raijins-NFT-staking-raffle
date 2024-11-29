import cx from "classnames";
import RaijinsModal from "../RaijinsModal";
import RoundButton from "../RoundButton";
import SetNumComp from "../SetNumComp";
import OwnedRaijinsTicketsComp from "../OwnedRaijinsTicketsComp";
import { Raijins_RAFFLES } from "config/raffles"

// ================================================

const BuyRafflesModal = ({
  openModal,
  setOpenModal,
  onDecreaseBuyNumBtn,
  onIncreaseBuyNumBtn,
  onCloseModal,
  raijinsTicketsNum,
  raffleIndex,
  raijinsTicketBalance,
  getTextForBtn,
  onUseRaijinsTicketsBtn,
  isMobile,
}) => {
  return (
    <RaijinsModal
      open={openModal}
      setOpen={setOpenModal}
      onCloseModal={onCloseModal}
      classes="buy-raffles-modal"
    >
      <div className={cx("d-flex", "justify-center", isMobile ? "flex-column" : "", "align-center", "gap-1")}>
        <img
          src={Raijins_RAFFLES[raffleIndex].image}
          alt="RaffleLion.png"
          width={isMobile ? 200 : 300}
        />
        <div className={cx("")}>
          <OwnedRaijinsTicketsComp
            variant="light"
            raijinsTicketBalance={raijinsTicketBalance}
            classes="border-none"
          />
          <p className={cx(" uppercase", "desc")}>
            choose the number of Raijins tickets you want to use
          </p>
          <SetNumComp
            onDecreaseBtn={onDecreaseBuyNumBtn}
            onIncreaseBtn={onIncreaseBuyNumBtn}
            num={raijinsTicketsNum}
            classes="mb-2 mt-2"
          />
          <div className="text-center">
            <RoundButton
              variant="primary"
              text={getTextForBtn()}
              onBtnClick={onUseRaijinsTicketsBtn}
            />
          </div>
        </div>
      </div>
      {/* <p className={cx("text-center", " uppercase", "mb-3", "desc")}>
        choose the number of Raijins tickets you want to use
      </p>
      <SetNumComp
        onDecreaseBtn={onDecreaseBuyNumBtn}
        onIncreaseBtn={onIncreaseBuyNumBtn}
        num={raijinsTicketsNum}
        classes="mb-2"
      />
      <div className="text-center mb-6">
        <RoundButton
          variant="primary"
          text={getTextForBtn()}
          onBtnClick={onUseRaijinsTicketsBtn}
        />
      </div> */}
      
    </RaijinsModal>
  );
};

export default BuyRafflesModal;
