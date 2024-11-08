import React from "react";
import PropTypes from "prop-types";

const List = ({ className, children }) => {
  return <ul className={className}>{children}</ul>;
};

List.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

List.defaultProps = {
  className: "",
};

export default List;
