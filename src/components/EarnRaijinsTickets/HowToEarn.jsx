import cx from "classnames";
import PageTitle from "../PageTitle";
import Description from "../Description";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Link } from "react-router-dom";
import RoundButton from "../RoundButton";

// ================================================

const HowToEarn = ({ earnRaijinsTicketCardContents }) => {
  const isMobile = useMediaQuery("only screen and (max-width: 640px)");

  const onBuyBtn = () => {
    const dom = document.querySelector("#buy-tickets");
    if (dom) {
      dom.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className={cx("how-to-earn")}>
      <PageTitle classes="earn-raijins-tickets-title">
        how to earn <span>raijins tickets</span>?
      </PageTitle>
      <Description
        classes={cx(
          "text-center",
          isMobile ? "w-100" : "w-30",
          "mx-auto",
          "mb-3"
        )}
      >
        There are four ways to earn Raijins tickets
      </Description>
      <div className={cx("cards-row")}>
        <div className="timeline timeline-four">
          <div className="timeline-item">
            <div className="icon"></div>
            <div className="date-content">
              <div className="date-outer">
                <span className='date'>
                  <i className='fa fa-hand-pointer'></i>
                  <span className='year mt-1'>
                    1 <br/>STAKING
                  </span>
                </span>
              </div>
            </div>
            <div className="timeline-content">
              <p className="mb-1">Staking Raijins NFTs is the easiest way to earn Raijins Tickets. Once staked, each Raijins NFT will award you with Raijins Tickets.</p>
              <Link to="/staking" className="round-btn primary">
                {earnRaijinsTicketCardContents[0].actionText}
              </Link>
            </div>
          </div>
          <div className="timeline-item">
            <div className="icon"></div>
            <div className="date-content">
              <div className="date-outer">
                <span className="date">
                  <i className="fa fa-edit"></i>
                  <span className="year mt-1">
                    2<br/>BUY WITH<br/>$MATIC</span>
                </span>
              </div>
            </div>
            <div className="timeline-content">
              <p>Buy Raijins Tickets directly with $MATIC</p>
              <p className="mb-1">1 Raijins Ticket = $0.35 (paid in $MATIC equivalent)</p>
              <RoundButton
                text={earnRaijinsTicketCardContents[1].actionText}
                variant="primary"
                onBtnClick={onBuyBtn}
              />
            </div>
          </div>
          <div className="timeline-item">
            <div className="icon"></div>
            <div className="date-content">
              <div className="date-outer">
                <span className="date">
                  <i className="fa fa-paper-plane"></i>
                  <span className='year mt-1'>3<br/>JOIN EVENTS</span>
                </span>
              </div>
            </div>
            <div className="timeline-content">
              <p className="mb-1">Be active on the Raijins Discord and Twitter is another way for you to earn Raijins Tickets! We host recurring events and contests where you can earn Raijins Tickets</p>
              <a
                className="round-btn primary"
                href="https://discord.gg/into-blue"
                target="_blank"
              >
                {earnRaijinsTicketCardContents[2].actionText}
              </a>
            </div>
          </div>
          <div className="timeline-item">
            <div className="icon"></div>
            <div className="date-content">
              <div className="date-outer">
                <span className="date">
                  <i className="fa fa-edit"></i>
                  <span className="year mt-1">
                    4<br/>[REDACTED]</span>
                </span>
              </div>
            </div>
            <div className="timeline-content">
              <p className="mb-1">[TO BE RELEASED IN PHASE 2]</p>
              <a className="round-btn primary">
                {earnRaijinsTicketCardContents[3].actionText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToEarn;
