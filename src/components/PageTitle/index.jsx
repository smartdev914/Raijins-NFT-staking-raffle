import cx from "classnames";
import "./index.scss";

// ================================================

const PageTitle = ({ children, classes }) => {
  return <h1 className={cx("page-title", classes)}>{children}</h1>;
};

export default PageTitle;
