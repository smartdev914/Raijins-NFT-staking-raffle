import cx from "classnames";

const EarnedTicketCard = ({ data, onNFTImgClick }) => {
  return (
    <div className={cx("earned-ticket-card", "mb-2")}>
      <h6 className={cx("nft-type", "mb-1")}>
        nft type: <span className={cx("italic")}>{data.label}</span>
      </h6>
      <div className={cx("d-flex", "justify-center", "mb-1")}>
        {data.images.map((image) => (
          <img
            src={image}
            key={image}
            alt={image}
            width="14%"
            className={cx("nft-image")}
            onClick={() => onNFTImgClick(image)}
          />
        ))}
      </div>
      <div className={cx("d-flex", "flex-column", "gap-1")}>
        <div className={cx("length-ticket")}>
          7 - day:{" "}
          <span className={cx("italic")}>
            {data.day7} ticket{data.day7 === 1 ? "" : "s"}
          </span>
        </div>
        <div className={cx("length-ticket")}>
          30 - day:{" "}
          <span className={cx("italic")}>
            {data.day30} ticket{data.day30 === 1 ? "" : "s"}
          </span>
        </div>
        <div className={cx("length-ticket")}>
          60 - day:{" "}
          <span className={cx("italic")}>
            {data.day60} ticket{data.day60 === 1 ? "" : "s"}
          </span>
        </div>
        <div className={cx("length-ticket")}>
          90 - day:{" "}
          <span className={cx("italic")}>
            {data.day90} ticket{data.day790 === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EarnedTicketCard;
