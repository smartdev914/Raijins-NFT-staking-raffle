import cx from "classnames";
import "./index.scss";

// ================================================

const Description = ({ children, classes }) => {
  return <p className={cx("description", classes)}>{children}</p>;
};

export default Description;
