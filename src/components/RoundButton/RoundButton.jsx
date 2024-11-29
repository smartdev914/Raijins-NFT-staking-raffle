import cx from "classnames";
import "./RoundButton.scss";

const RoundButton = (props) => {
  const { text, variant, onBtnClick, classes, disabled } = props;

  // ------------------------------------------------
  return (
    <button
      className={cx("round-btn", variant, classes)}
      onClick={onBtnClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default RoundButton;
