import cx from "classnames";
import "./index.scss";

// ================================================

const SectionTitle = ({ children, classes }) => {
  return <h2 className={cx("section-title", classes)}>{children}</h2>;
};

export default SectionTitle;
