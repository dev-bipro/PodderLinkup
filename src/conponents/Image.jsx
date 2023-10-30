import React from 'react'

const Image = ({className, imageUrl, alt}) => {
  return (
    <picture>
        <img className={className} src={imageUrl} alt={alt} />
    </picture>
  )
}

export default Image