import cx from "classnames";
import "./index.scss";

const RaijinsSelect = ({ options, handleChange }) => {
  return (
    <div className={cx("raijins-select-container")}>
      <label>
        <select className={cx("raijins-select")} onChange={handleChange}>
          {options &&
            options.length &&
            options.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              );
            })}
        </select>
      </label>
    </div>
  );
};

export default RaijinsSelect;
