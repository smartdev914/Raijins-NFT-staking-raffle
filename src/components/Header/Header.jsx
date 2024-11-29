import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";
import { GiHamburgerMenu } from "react-icons/gi";
// import HorizontalDivider from "../HorizontalDivider";
import LogoImg from "assets/images/common/logo.png";
// import TwitterImg from "assets/images/common/twitter-icon.svg";
// import DiscordImg from "assets/images/common/Discord.png";
import "./Header.scss";
import { AppHeaderUser } from "./AppHeaderUser";

// ================================================

const pageLinks = [
  {
    id: "faq",
    text: "faq",
    to: "/faq",
  },
  {
    id: "earn-raijins-tickets",
    text: "earn raijins tickets",
    to: "/earn-raijins-tickets",
  },
  {
    id: "staking-for-ticket",
    text: "staking for ticket",
    to: "/staking-for-ticket",
  },
  {
    id: "staking-for-matic",
    text: "staking for matic",
    to: "/staking-for-matic",
  },
  {
    id: "raffles",
    text: "raffles",
    to: "/raffles",
  },
  {
    id: "dashboard",
    text: "dashboard",
    to: "/dashboard",
  },
];

// ================================================

const Header = (props) => {
  const {
    disconnectAccountAndCloseSettings,
    openSettings,
    setWalletModalVisible,
    redirectPopupTimestamp,
    showRedirectModal,
    mode,
    onSetModeBtn,
  } = props;

  // ------------------------------------------------

  const location = useLocation();
  const { pathname } = location;

  const isMobile = useMediaQuery("only screen and (max-width: 640px)");

  const [isNavVisible, setIsNavVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target)
      ) {
        setIsNavVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileNavRef]);

  // ------------------------------------------------

  return (
    <>
      <header
        className={cx("app-header")}
      >
        <div className={cx("d-flex", "align-center")}>
          <Link to="/">
            <div className={cx("logo-container")}>
              <img src={LogoImg} alt="logo" width="38" />
              <div className={cx("i-raijins")}>
                Raijins
              </div>
            </div>
          </Link>
        </div>
        {isMobile ? (
          isNavVisible ? (
            <nav className={cx("Nav", "mobile")} ref={mobileNavRef}>
              {/* <div className={cx("social-link-container")}>
                {socialLinks.map((link) => (
                  <Link
                    to={link.to}
                    target="_blank"
                    className={cx("social-link")}
                    key={link.id}
                    onClick={() => setIsNavVisible(false)}
                  >
                    <img src={link.image} alt={`${link.id}.png`} width={48} />
                  </Link>
                ))}
              </div>
              <HorizontalDivider /> */}
              <div className={cx("page-link-container")}>
                {pageLinks.map((link) => (
                  <Link
                    to={link.to}
                    key={link.id}
                    className={cx(
                      "page-link",
                      pathname == link.to ? "active" : ""
                    )}
                    onClick={() => setIsNavVisible(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null
        ) : (
          <nav className={cx("Nav")}>
            <div className={cx("social-link-container")}>
              {/* {socialLinks.map((link) => (
                <Link
                  to={link.to}
                  target="_blank"
                  className={cx("social-link")}
                  key={link.id}
                >
                  <img src={link.image} alt={`${link.id}.png`} width={48} />
                </Link>
              ))} */}
            </div>
            <div className={cx("page-link-container")}>
              {pageLinks.map((link) => (
                <Link
                  to={link.to}
                  key={link.id}
                  className={cx(
                    "page-link",
                    pathname == link.to ? "active" : ""
                  )}
                >
                  {link.text}
                </Link>
              ))}
            </div>
            <div className={cx("d-flex", "justify-center")}>
              <AppHeaderUser
                disconnectAccountAndCloseSettings={
                  disconnectAccountAndCloseSettings
                }
                openSettings={openSettings}
                small
                setWalletModalVisible={setWalletModalVisible}
                redirectPopupTimestamp={redirectPopupTimestamp}
                showRedirectModal={showRedirectModal}
                mode={mode}
                onSetModeBtn={onSetModeBtn}
              />
            </div>
          </nav>
        )}
        <div className={cx("header-right-container")}>
          <div className={cx("d-flex", "justify-center")}>
            <AppHeaderUser
              disconnectAccountAndCloseSettings={
                disconnectAccountAndCloseSettings
              }
              openSettings={openSettings}
              small
              setWalletModalVisible={setWalletModalVisible}
              redirectPopupTimestamp={redirectPopupTimestamp}
              showRedirectModal={showRedirectModal}
              mode={mode}
              onSetModeBtn={onSetModeBtn}
            />
          </div>
          <button className={cx("burger")} onClick={toggleNav}>
            <GiHamburgerMenu color="white" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
