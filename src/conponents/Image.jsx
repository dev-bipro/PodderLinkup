import React from "react";
import PropTypes from "prop-types";

const Image = ({ className, imageUrl, alt }) => {
  return (
    <picture>
      <img
        className={className}
        src={imageUrl}
        alt={alt}
        loading="lazy" // Optional for performance improvement
      />
    </picture>
  );
};

Image.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

Image.defaultProps = {
  className: "",
};

export default Image;
