import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./index.scss";
import { AiOutlineClose } from "react-icons/ai";
// import XImage from "assets/images/common/X.png";

// ================================================

const RaijinsModal = ({
  children,
  open,
  setOpen,
  onOpenModal,
  onCloseModal,
  classes,
}) => {
  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      center
      classNames={{ modal: `raijins-modal ${classes}` }}
    >
      <button onClick={onCloseModal} className="shut-btn">
        {/* <img src={XImage} alt="X.png" /> */}
        <AiOutlineClose />
      </button>
      {children}
    </Modal>
  );
};

export default RaijinsModal;
