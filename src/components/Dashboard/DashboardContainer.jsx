import cx from "classnames";

const DashboardContainer = ({ children }) => {
  return (
    <div className={cx("dashboard-container")}>
      {children}
    </div>
  );
};

export default DashboardContainer;
