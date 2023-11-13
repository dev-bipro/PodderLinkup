import React, { useEffect } from 'react'
import './Home.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Nav from '../../conponents/nav/Nav'
import Container from '../../conponents/Container'
import NewPost from '../../conponents/post/NewPost'

const Home = () => {
  const navigate = useNavigate();
    const logedinData = useSelector((state)=> state.logedin.value)

    useEffect(()=>{
      if (!logedinData) {
        navigate("/")

      }
    })
  return (
    <>
      <NewPost />
    </>
  )
}

export default Home