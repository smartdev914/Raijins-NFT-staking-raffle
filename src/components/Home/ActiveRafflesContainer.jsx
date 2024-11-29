import cx from "classnames";

// ================================================

const ActiveRafflesContainer = ({ children }) => {
  return (
    <div className={cx("active-raffles-container")} id="active-raffles">
      {children}
    </div>
  );
};

export default ActiveRafflesContainer;
