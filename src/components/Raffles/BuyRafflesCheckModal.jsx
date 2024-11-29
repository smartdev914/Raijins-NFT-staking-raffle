import cx from "classnames";
import RaijinsModal from "../RaijinsModal";
import { Raijins_RAFFLES } from "config/raffles"
import RoundButton from "../RoundButton";
import { Link } from "react-router-dom";

const BuyRafflesCheckModal = ({
  openModal,
  setOpenModal,
  onCloseModal,
  raijinsTicketsNum,
  raffleIndex,
  isMobile,
}) => {

  return (
    <RaijinsModal
      open={openModal}
      setOpen={setOpenModal}
      onCloseModal={onCloseModal}
      classes="buy-check-modal"
    >
      <div className={cx("text-center", "mb-3")}>
        <img
          src={Raijins_RAFFLES[raffleIndex].image}
          alt="RaffleLion.png"
          width={isMobile ? 200 : 300}
        />
      </div>
      <h4 className={cx("text-center", "title", "uppercase", "font-yokomoji", "mb-5")}>
        you used <span>{raijinsTicketsNum} raijins tickets</span> !
      </h4>
      <p className={cx("desc", "uppercase", "text-center", "font-yokomoji", "italic", "mb-3")}>
        congratulations, your raffle entry has been successfully registered
      </p>
      <div className={cx("text-center")}>
        <Link to="/dashboard" className="round-btn danger">
          check your activities
        </Link>
      </div>
    </RaijinsModal>
  );
};

export default BuyRafflesCheckModal;
