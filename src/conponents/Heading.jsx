import React from 'react'

const Heading = (props) => {
  return (
      <>
        <props.tagName className={props.className}>{props.title}</props.tagName>
        {
            props.children
        }
    </>
  )
}

export default Heading