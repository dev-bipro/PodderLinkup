import React from "react";
import PropTypes from "prop-types";

const Container = ({ className, children, ...props }) => {
  return (
    <div className={`container ${className}`} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Container.defaultProps = {
  className: "",
};

export default Container;
