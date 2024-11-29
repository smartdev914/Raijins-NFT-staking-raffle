import { NavLink } from "react-router-dom";
import RaijinsModal from "../RaijinsModal";
import RaijinsTicketImage from "assets/images/common/RaijinsTicket.png";
import RoundButton from "../RoundButton";

// ================================================

const BoughtRaijinsTicketsModal = ({
  openModal,
  setOpenModal,
  onCloseModal,
  buyNum,
}) => {
  return (
    <RaijinsModal
      open={openModal}
      setOpen={setOpenModal}
      onCloseModal={onCloseModal}
      classes="bought-raijins-tickets-modal"
    >
      <h4 className="title text-center uppercase mb-3">
        you bought <br />
        <span className="status">{buyNum} raijins tickets</span>!
      </h4>
      <div className="text-center mb-4 raijins-ticket-container">
        <img src={RaijinsTicketImage} alt="RaijinsTicket.png" width="160px" />
      </div>
      <p className="desc text-center uppercase italic font-yokomoji mb-6">
        CONGRATULATIONS, YOUR PURCHASE HAS BEEN SUCCESSFULLY COMPLETED. YOUR Raijins TICKETS HAVE BEEN CREDITED TO YOUR WALLET!
      </p>
      <div className="text-center">
        <NavLink to="/raffles" className="round-btn primary">
          spend tickets
        </NavLink>
      </div>
    </RaijinsModal>
  );
};

export default BoughtRaijinsTicketsModal;
