import React from "react";
import "./styles.css";

function Selector({
  options = [],
  label = "",
  onchange = function () {},
  value = "Agregar",
  multiple = false,
}) {
  return (
    <div className="container-field">
      <label className="label">{label}</label>
      <select
        className="selector"
        onChange={(e) => {
          if (multiple) {
            const selectedValues = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            onchange(selectedValues);
          } else {
            onchange(e.target.value);
          }
        }}
        defaultValue={multiple ? [] : "Agregar"}
        value={multiple ? (Array.isArray(value) ? value : [value]) : value}
        multiple={multiple}
      >
        {/* <option value={null}>{null}</option> */}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Selector;
