import { Link } from "react-router-dom";
import cx from "classnames";
import BackToTopBtn from "../BackToTopBtn";

// import NineTailsLogoImg from "assets/images/footer/NinetailsLogo.png";
import LogoImg from "assets/images/common/logo.png";
import "./index.scss";

// ================================================

const Footer = () => {
  return (
    <div className={cx("footer")}>
      {/* <p className={cx("slogan")}>
        we are <span>inevitable!</span>
      </p> */}
      {/* <div className={cx("links")}> */}
      <div className="logo-container">
        <img src={LogoImg} alt="nine-tails-ink" width="50" />
      </div>
      <div className={cx("copyright")}>
        &copy; 2024 by bluespade{" "}
      </div>
      <div className={cx("mail-container")}>
        <Link to="/">Bluespadexyz@gmail.com</Link>
      </div>
      <div className={cx("back-to-top-container")}>
        <BackToTopBtn />
      </div>
      {/* </div> */}
    </div>
  );
};

export default Footer;
