import cx from "classnames";
import { useMediaQuery } from "@uidotdev/usehooks";
import PageTitle from "components/PageTitle";
import Description from "components/Description";
import HeroContainer from "./HeroContainer";
import RoundButton from "components/RoundButton";
import { Link } from "react-router-dom";
// import ScrollButton from "components/ScrollButton";

// ================================================

const Hero = () => {
  const isMobile = useMediaQuery("only screen and (max-width: 640px)");

  const onActiveRafflesBtn = () => {
    const dom = document.querySelector("#active-raffles");
    if (dom) {
      dom.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HeroContainer>
      <PageTitle classes={cx("mb-8")}>
        The <span>Raijins</span>
      </PageTitle>
      <div
        className={cx(
          "description-section",
          isMobile ? "w-80" : "w-30",
          "mx-auto"
        )}
      >
        <Description classes={cx("text-center", "mb-3")}>
          Raijins is more than just a project, we are a community destined to shape the future of this ecosystem.
        </Description>
        <Description classes={cx("text-center", "mx-auto", "mb-5")}>
          It's a place where you can stake your Raijins NFTs, earn Raijins Tickets and
          try your luck at winning unique prizes.
        </Description>
        <Link to="/staking">
          <RoundButton
            text="staking"
            variant="primary"
            classes="w-50 mx-auto d-block mb-2"
          />
        </Link>
        {/* <RoundButton
          text="active raffles"
          variant="transparent"
          classes={`w-50 mx-auto d-block ${isMobile ? "" : "mb-4"}`}
          onBtnClick={onActiveRafflesBtn}
        /> */}
        {/* {
          isMobile ?
            <></>
            :
            <div className="scroll-btn-wrapper">
              <ScrollButton />
            </div>
        } */}
      </div>
    </HeroContainer>
  );
};

export default Hero;
