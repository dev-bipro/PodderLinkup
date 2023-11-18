import React from 'react'

const Flex = ({onClick, className, children}) => {
  return (
    <div onClick={onClick} className={className}>{children}</div>
  )
}

export default Flex