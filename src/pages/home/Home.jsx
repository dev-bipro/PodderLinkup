import React, { useEffect } from 'react'
import './Home.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Nav from '../../conponents/nav/Nav'

const Home = () => {
  const navigate = useNavigate();
    const logedinData = useSelector((state)=> state.logedin.value)

    useEffect(()=>{
      if (!logedinData) {
        navigate("/")

      }
    })
  return (
    <section>
      <h1>home</h1>
    </section>
  )
}

export default Home