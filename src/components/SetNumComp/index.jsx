import cx from "classnames";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./index.scss";

// ================================================

const SetNumComp = ({ onIncreaseBtn, onDecreaseBtn, num, classes }) => {
  return (
    <div className={cx("set-num-container", classes)}>
      <button onClick={onDecreaseBtn} disabled={!num}>
        <FaMinus />
      </button>
      <div className={cx("num")}>{num}</div>
      <button onClick={onIncreaseBtn}>
        <FaPlus />
      </button>
    </div>
  );
};

export default SetNumComp;
