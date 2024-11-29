import cx from "classnames";
import TransparentImage from "assets/images/dashboard/Transparent.png";

// ================================================

const ImageContainer = () => {
  return (
    <div
      className={cx(
        "image-container",
        "d-flex",
        "flex-column",
        "justify-end"
      )}
    >
      <img src={TransparentImage} alt="transparent.png" />
    </div>
  );
};

export default ImageContainer;
