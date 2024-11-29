import cx from "classnames";
import OwnedRaijinsTicketsComp from "../OwnedRaijinsTicketsComp";
// import TOTPrizeWonComp from "../TOTPrizeWonComp";

const GeneralStats = ({ isMobile, raijinsTicketBalance, activeRaffles }) => {
  // const wonTOTPrizesNum = 15234;
  const liveRaffles = activeRaffles.filter((item) => !item.ended);

  return (
    <div className={cx("general-stats")}>
      <h4
        className={cx(
          isMobile ? "text-white" : "text-primary",
          "uppercase",
          // "italic",
          "mb-3"
        )}
      >
        general stats
      </h4>
      <div
        className={cx(
          "d-flex",
          isMobile ? "flex-column" : "flex-row",
          "justify-between",
          isMobile ? "align-center" : "",
          "mb-3",
          "gap-1"
        )}
      >
        <OwnedRaijinsTicketsComp
          raijinsTicketBalance={raijinsTicketBalance}
          variant={isMobile ? "light" : "primary"}
        />
        {/* <TOTPrizeWonComp
          wonTOTPrizesNum={wonTOTPrizesNum}
          variant={isMobile ? "light" : "dark"}
        /> */}
      </div>
      <h5 className={cx("uppercase", "italic", "text-warning", "yokomoji", "mb-3")}>
        {liveRaffles.length === 0 ? "no active raffles" : "active raffles participation"}
      </h5>
      <div className={cx("raffles-table-wrapper")}>
        <table className={cx("raffles-table", "uppercase", "italic")}>
          <tbody>
            {liveRaffles.map((raffle) => (
              <tr key={raffle.title}>
                <td className={cx(isMobile ? "text-black" : "text-white")}>
                  {raffle.title}
                </td>
                <td>{raffle.ticketCntForUser ? raffle.ticketCntForUser : 0} raijins tickets</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralStats;
