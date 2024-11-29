import cx from "classnames";
import CircularArrowImg from "assets/images/common/Arrow.png";
import XImage from "assets/images/common/XLight.png";

const RaijinsStakedCard = ({
  nft,
  selectStatusStaked,
  index,
  handleSelectNFTStaked,
  timeTypeInfo,
}) => {
  return (
    <div className={cx("raijins-staked-card")}>
      <div className={cx("img-container")}>
        <img src={nft.image} alt={`${nft.image}`} width="100%" />
      </div>
      <div>
        <p className={cx("text-secondary", "uppercase", "mb-1")}>
          NFT #: <br />
          <span className={cx("text-primary", "italic")}>
            {nft.name} #{nft.id}
          </span>
        </p>
        <p className={cx("text-secondary", "uppercase", "mb-1")}>
          auto restake:{" "}
          <button className={cx("auto-restake-btn")}>
            <img
              src={nft.autoRestake === true ? CircularArrowImg : XImage}
              alt="arrow.png"
              width="100%"
            />
          </button>
        </p>
        <p className={cx("text-secondary", "uppercase", "mb-1")}>
          remaining period:{" "}
          <span className={cx("text-primary", "italic")}>
            {nft.leftTime} days left
            <br />({timeTypeInfo[nft.timeType].period} days programme)
          </span>
        </p>
        <p className={cx("text-secondary", "uppercase", "mb-1")}>
          next reward:{" "}
          <span className={cx("text-primary", "italic")}>
            {nft.nextTicket} raijins tickets
          </span>
        </p>
        <p className={cx("text-secondary", "uppercase", "mb-1")}>
          claimable reward:{" "}
          <span className={cx("text-primary", "italic")}>
            {nft.claimableTicket} raijins tickets
          </span>
        </p>
      </div>
      <div className="raijins-checkbox">
        <input
          type="checkbox"
          id={`raijinsCheckbox-${index}`}
          checked={selectStatusStaked[index] === true}
          onChange={() => handleSelectNFTStaked(index)}
          value={selectStatusStaked[index]}
        />
        <label htmlFor={`raijinsCheckbox-${index}`}></label>
      </div>
    </div>
  );
};

export default RaijinsStakedCard;
