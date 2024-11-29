import { useEffect, useState } from "react";
import cx from "classnames";
import ScrollBtnImg from "assets/images/common/Mousedown.gif";
import "./index.scss";

const ScrollButton = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={cx("scroll-btn")}>
      <div className={cx("img-container")}>
        <img src={ScrollBtnImg} alt="scroll-btn" width="100%" />
      </div>
    </div>
  );
};

export default ScrollButton;
