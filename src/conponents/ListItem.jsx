import React from 'react'

const ListItem = ({className, title, children}) => {
  return (
    <li className={className}>{title}{children}</li>
  )
}

export default ListItem