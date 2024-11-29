import cx from "classnames";
import { Link } from "react-router-dom";
import LeftArrowCircle from "assets/images/home/leftArrowCircle.png";

// ================================================

const ToFAQs = () => {
  return (
    <div className={cx("to-faqs")}>
      <Link
        to="/faq"
        className={cx("d-flex", "align-center", "gap-1", "justify-end")}
      >
        faq <img src={LeftArrowCircle} alt="arrow" />
      </Link>
    </div>
  );
};

export default ToFAQs;
