import { CopyToClipboard } from "react-copy-to-clipboard";
import copy from "assets/images/ic_copy_16_dark.png";
import { helperToast } from "lib/helperToast";
import cx from "classnames";
import "./index.scss";

const CopyBtn = ({ text, classes }) => {
  return (
    <CopyToClipboard
      text={text}
      onCopy={() =>
        helperToast.success(<p>Address copied to your clipboard</p>)
      }
    >
      <button className={cx("copy-btn", classes)}>
        <img src={copy} alt="Copy user address" width="16px" />
      </button>
    </CopyToClipboard>
  );
};

export default CopyBtn;
