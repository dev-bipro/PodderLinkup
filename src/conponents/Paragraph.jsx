import React from 'react'

const Paragraph = ({className, title, children}) => {
  return (
    <p className={className}>{title}{children}</p>
  )
}

export default Paragraph