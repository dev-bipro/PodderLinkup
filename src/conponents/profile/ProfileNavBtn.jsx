import React from 'react'
import ListItem from './ListItem'
import Paragraph from '../Paragraph'

const ProfileNavBtn = ({onClick, profileNavBtnClass, profileNavBtnPraClass, profileNavBtnTitle}) => {
  return (
    <ListItem onClick={onClick} className={profileNavBtnClass}>
        <Paragraph className={profileNavBtnPraClass} title={profileNavBtnTitle} />
    </ListItem>
  )
}

export default ProfileNavBtn