const React = require("react");

const Checkbox = ({ label, checkboxId, isSelected, onCheckboxChange, score }) => {
  return (
    <div className="form-check">
      <label className="row" style={{alignItems: "center"}}>
        <input
          type="checkbox"
          className="form-check-input"
          name={label}
          checked={isSelected}
          onChange={onCheckboxChange}
          value={score}
          id={checkboxId}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

module.exports = Checkbox;