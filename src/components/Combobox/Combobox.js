import Select from "react-select";

const customStyles = {
  container: (provided) => ({
    ...provided,
    boxShadow: "0px 0px 3px rgba(255, 255, 255)",
    fontFamily: "poppins",
    // borderRadius: "25px",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "#111111",
    // boxShadow: "0px 0px 3px rgba(255, 255, 255)",
    // borderRadius: "25px",
    padding: "0.5rem",
    border: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: "10px",
    backgroundColor: state.isFocused ? "#222222" : "#111111",
    fontFamily: "poppins",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#bbbbbb",
  }),
  noOptionsMessage: (provided, state) => ({
    ...provided,
    backgroundColor: "#111111",
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#111111",
    borderRadius: "10px",
    // boxShadow: "0px 0px 1.8px rgba(214, 214, 214, 0.12)",
  }),
  input: (provided, state) => ({
    ...provided,
    color: "#bbbbbb",
  }),
};

const Combobox = ({ options, value, onChange }) => (
  <Select
    options={options}
    styles={customStyles}
    value={value}
    onChange={onChange}
  />
);

export default Combobox;
