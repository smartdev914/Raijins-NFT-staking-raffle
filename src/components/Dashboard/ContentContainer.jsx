import cx from "classnames";
import PageTitle from "components/PageTitle";

// ================================================

const ContentContainer = ({ children, isMobile }) => {
  return (
    <div
      className={cx(
        "title-container",
        "d-flex",
        "justify-center",
        "flex-column"
      )}
    >
      <PageTitle classes={cx("mb-3", isMobile ? "w-100" : "w-60", "mx-auto")}>
        your raijins <span>dashboard</span>
      </PageTitle>
      {children}
    </div>
  );
};

export default ContentContainer;
