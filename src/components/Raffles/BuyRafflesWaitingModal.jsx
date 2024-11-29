import cx from "classnames";
import RaijinsModal from "../RaijinsModal";
import KYORotateImage from "assets/images/common/KYORotate.gif";
import DangerKeepOutImage from "assets/images/earn/DangerKeepOut.png";

const BuyRafflesWaitingModal = ({
  openModal,
  setOpenModal,
  onCloseModal,
  isMobile,
}) => {
  return (
    <RaijinsModal
      open={openModal}
      setOpen={setOpenModal}
      onCloseModal={onCloseModal}
      classes="buy-raffles-waiting-modal"
    >
      <div className={cx("text-center", "mb-3")}>
        <img
          src={KYORotateImage}
          alt="KYORotate.gif"
          width={isMobile ? 150 : 200}
        />
      </div>
      <h4 className={cx("title", "uppercase", "italic", "text-center", "mb-3")}>
        raffle entry
      </h4>
      <p
        className={cx(
          "uppercase",
          "italic",
          "text-danger",
          "mb-3",
          "desc",
          "font-yokomoji",
          "text-center"
        )}
      >
        your raffle entry is being processed...
      </p>
      <div className={cx("text-center", "mb-3")}>
        <img src={DangerKeepOutImage} alt="danger-keep-out.png" width={50} />
      </div>
      <p className={cx("uppercase", "italic", "text-danger", "mb-3", "font-yokomoji", "desc")}>
        waiting for wallet transaction confirmation
      </p>
    </RaijinsModal>
  );
};

export default BuyRafflesWaitingModal;
