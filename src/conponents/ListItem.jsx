import React from "react";
import PropTypes from "prop-types";

const ListItem = ({ onClick, className, title, children }) => {
  return (
    <li
      onClick={onClick}
      className={className}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter") onClick();
      }} // Handle Enter key press
    >
      {title}
      {children}
    </li>
  );
};

ListItem.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

ListItem.defaultProps = {
  onClick: null,
  className: "",
  children: null,
};

export default ListItem;
