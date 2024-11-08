import React from "react";
import PropTypes from "prop-types";

const Paragraph = ({ className, title, children }) => {
  return (
    <p className={className}>
      {title && <span>{title}</span>} {/* Render title only if it exists */}
      {children}
    </p>
  );
};

Paragraph.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Paragraph.defaultProps = {
  className: "",
  children: null,
};

export default Paragraph;
