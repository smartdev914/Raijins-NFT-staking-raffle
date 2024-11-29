import cx from "classnames";

const RaijinsStakingCard = ({
  nft,
  timeTypeInfo,
  currentTimeType,
  index,
  selectStatusInWallet,
  handleSelectNFTInWallet,
}) => {
  return (
    <div className={cx("raijins-staking-card")}>
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
          staking period:{" "}
          <span className={cx("text-primary", "italic")}>
            {timeTypeInfo[currentTimeType].period} day
          </span>{" "}
        </p>
        <p className={cx("text-secondary", "uppercase", "mb-1")}>
          estimated reward:
          <br />{" "}
          <span className={cx("text-primary", "italic")}>
            {nft.rewards} raijins tickets
          </span>
        </p>
      </div>
      <div className="raijins-checkbox">
        <input
          type="checkbox"
          id={`raijinsCheckbox-${index}`}
          checked={selectStatusInWallet[index] === true}
          onChange={() => handleSelectNFTInWallet(index)}
          value={selectStatusInWallet[index]}
        />
        <label htmlFor={`raijinsCheckbox-${index}`}></label>
      </div>
    </div>
  );
};

export default RaijinsStakingCard;
