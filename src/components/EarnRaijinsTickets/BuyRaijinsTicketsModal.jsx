import RaijinsModal from "../RaijinsModal";
import AvatarKYORotate from "assets/images/common/KYORotate.gif";
import DangerKeepOutImage from "assets/images/earn/DangerKeepOut.png";

// ================================================

const BuyRaijinsTicketsModal = ({ openModal, setOpenModal, onCloseModal }) => {
  return (
    <RaijinsModal
      open={openModal}
      setOpen={setOpenModal}
      onCloseModal={onCloseModal}
      classes="buy-raijins-tickets-modal"
    >
      <div className="text-center mb-3">
        <img src={AvatarKYORotate} alt="avatar.png" width={120} />
      </div>
      <h4 className="title text-center uppercase font-yokomoji mb-3">
        purchase is in progress
      </h4>
      <p className="desc text-center mb-5 uppercase font-yokomoji italic">
        your raijins ticket purchase is being <br />
        processed...
      </p>
      <div className="text-center mb-1 danger-keep-out-container">
        <img src={DangerKeepOutImage} alt="DangerKeepOut.png" width="60px" />
      </div>
      <p className="status text-center uppercase italic">
        waiting for wallet transaction <br /> confirmation
      </p>
    </RaijinsModal>
  );
};

export default BuyRaijinsTicketsModal;
