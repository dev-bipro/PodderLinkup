import React from "react";
import PropTypes from "prop-types";

const Flex = ({ onClick, className, children }) => {
  return (
    <div
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      role="button"
      tabIndex={0}
      className={`flex ${className}`}
    >
      {children}
    </div>
  );
};

Flex.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Flex.defaultProps = {
  onClick: null,
  className: "",
};

export default Flex;
