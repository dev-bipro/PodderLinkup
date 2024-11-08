import React from "react";
import PropTypes from "prop-types";

const GrowingInput = ({ value, onChange }) => {
  return (
    <input
      aria-label="Growing input"
      placeholder="Type here..."
      style={{
        width: Math.min(Math.max(value.length, 2), 50) + "ch",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        transition: "width 0.2s ease",
      }}
      value={value}
      onChange={onChange}
      type="text"
    />
  );
};

GrowingInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GrowingInput;
