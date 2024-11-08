import React from "react";
import PropTypes from "prop-types";

const Heading = ({ tagName, className, title, children }) => {
  const Tag = tagName; // Dynamic component rendering

  return (
    <>
      <Tag className={className}>{title}</Tag>
      {children}
    </>
  );
};

Heading.propTypes = {
  tagName: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Heading.defaultProps = {
  className: "",
  children: null,
};

export default Heading;
