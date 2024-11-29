import cx from "classnames";

// ================================================

const HeroContainer = ({ children }) => {
  return <div className={cx("hero-container")}>{children}</div>;
};

export default HeroContainer;
