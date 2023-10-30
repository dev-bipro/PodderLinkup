import React, { useEffect, useState } from 'react'
import './registration.css'
import Image from '../../../conponents/Image'
import myLogo from '../../../assets/myLogoLikeLinkdin.svg'
import Heading from '../../../conponents/Heading'
import Paragraph from '../../../conponents/Paragraph'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import Alert from '@mui/material/Alert';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { FallingLines } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'


const Registration = () => {
    const auth = getAuth();
    const db = getDatabase();
    const logedinData = useSelector((state)=> state.logedin.value) ;
    const navigate = useNavigate();
    useEffect(()=>{
        if (logedinData) {
            navigate("/home")
        }
    })
    const [formData, setFormData] = useState({
        fullName:"",
        email:"",
        password:""
    })
    const [fullNameError, setFullNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordShow, setPasswordShow] = useState(false)
    const [load,setLoad] = useState(true)
    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
        // console.log(formData);
        if (e.target.name == "fullName") {
            setFullNameError("")
        }
        else if (e.target.name == "email") {
            setEmailError("")
        }
        else if (e.target.name == "password") {
            setPasswordError("")
        }
    }
    const clickHandler = () => {

        if (!formData.fullName) {
            setFullNameError("please type your name !")
        }
        if (!formData.email) {
            setEmailError("please type your email !")
        }
        if (!formData.password) {
            setPasswordError("please type your password !")
        }
        if (formData.fullName && formData.email && formData.password) {

            const fullNameArr = formData.fullName.split("") ;
            const validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

            if (formData.fullName.length < 3 || fullNameArr.find(el => !isNaN(el-1))) {
                if (formData.fullName.length <3) {
                    setFullNameError("enter name min 3 letter's") ;
                }
                if (fullNameArr.find(el => !isNaN(el-1))) {
                    setFullNameError("invalid name") ;
                }
            }
            if (!validEmail.test(formData.email)) {
                setEmailError("type a validmail")
            }
            if (formData.password.length < 6) {
                setPasswordError("type password min 6 letter's")
            }
            if (formData.fullName.length > 2 && fullNameArr.find(el => isNaN(el-1)) && validEmail.test(formData.email) && formData.password.length > 5) {
                setLoad(false) ;
                setTimeout(()=>{
                    setLoad(true)
                    createUserWithEmailAndPassword(auth, formData.email, formData.password)
                    .then((user) => {
                        updateProfile(auth.currentUser, {
                            displayName: formData.fullName,
                            photoURL: "https://firebasestorage.googleapis.com/v0/b/podderlinkup.appspot.com/o/profileAvator.png?alt=media&token=fdd8b240-45b4-4db4-8c3f-9099ce091631&_gl=1*1okedv4*_ga*OTcxMzU0MDUwLjE2OTc2NTg5MzQ.*_ga_CW55HF8NVT*MTY5NzcxNjIwMi40LjEuMTY5NzcxNjU2NS42MC4wLjA.",
                            // coverPhotoURL:"https://firebasestorage.googleapis.com/v0/b/podderlinkup.appspot.com/o/coverImage.jpeg?alt=media&token=2f33d9f6-c096-4f2f-bf00-002955d41987&_gl=1*uebs67*_ga*OTcxMzU0MDUwLjE2OTc2NTg5MzQ.*_ga_CW55HF8NVT*MTY5NzcxNjIwMi40LjEuMTY5NzcxNjUxMS4zNC4wLjA."
                        }).then(() => {
                            // Profile updated!
                            sendEmailVerification(auth.currentUser).then(()=>{
                                set(ref(db,"user/"+user.user.uid),{
                                    fullName: formData.fullName,
                                    email: formData.email,
                                    photoURL: "https://firebasestorage.googleapis.com/v0/b/podderlinkup.appspot.com/o/profileAvator.png?alt=media&token=fdd8b240-45b4-4db4-8c3f-9099ce091631&_gl=1*1okedv4*_ga*OTcxMzU0MDUwLjE2OTc2NTg5MzQ.*_ga_CW55HF8NVT*MTY5NzcxNjIwMi40LjEuMTY5NzcxNjU2NS42MC4wLjA.",
                                    coverPhotoURL:"https://firebasestorage.googleapis.com/v0/b/podderlinkup.appspot.com/o/coverImage.jpg?alt=media&token=e537d440-bdcd-469b-a34d-f6e6cfb8ada6&_gl=1*1oevo62*_ga*OTcxMzU0MDUwLjE2OTc2NTg5MzQ.*_ga_CW55HF8NVT*MTY5Nzc5MjQ0OS45LjEuMTY5Nzc5MjY5My40Ny4wLjA."
                                }).then(()=>{
                                    toast.success('🦄 Wow so easy!', {
                                        position: "top-left",
                                        autoClose: 3000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "dark",
                                    });
                                    setTimeout(()=>{
                                        navigate("/")
                                    },6000)
                                })

                            
                            })
                            // ...
                        })
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // ..
                        console.log(errorMessage);
                        if (errorMessage.includes("email-already")) {
                            setEmailError("email-already used") ;
                            toast.error('🦄 Wow so easy!', {
                                position: "top-left",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            setTimeout(()=>{
                                setEmailError("") ;
                                navigate("/")
                            },6000)
                        }
                    });

                },3400)
            }
        }
    }
  return (
    <section>
        <div className="registrationContent">
            <div className="regLogoDiv">
                <Image className="regLogo" imageUrl={myLogo} />
            </div>
            <Heading tagName="h1" className="regHeading" title="get started with easily register">
                <Paragraph className="regSubHeading" title="free register and you can enjoy it" />
            </Heading>
            {
                fullNameError && <Alert severity="error">{fullNameError}</Alert>
            }
            <TextField onChange={changeHandler} name='fullName' type="text" className="regInput" id="outlined-basic" label="Full Name" variant="outlined" />
            {
                emailError && <Alert severity="error">{emailError}</Alert>
            }
            <TextField onChange={changeHandler} name='email' type="email" className="regInput" id="outlined-basic" label="Email Addres" variant="outlined" />
            {
                passwordError && <Alert severity="error">{passwordError}</Alert>
            }
            <div className="passwordInput">
                <TextField onChange={changeHandler} name='password' type={passwordShow ? "text" : "password"} className="regInput" id="outlined-basic" label="Password" variant="outlined" />
                <div className="passwordEyes">
                    {
                        passwordShow ?
                            <AiFillEye onClick={()=>setPasswordShow(false)} />
                        :
                            <AiFillEyeInvisible onClick={()=>setPasswordShow(true)} />
                    }
                </div>
            </div>
            {
                !load?
                    <Button className="regBtn" variant="contained">
                        <FallingLines
                            color="#fff"
                            width="35"
                            visible={true}
                            ariaLabel='falling-lines-loading'
                        />
                    </Button>
                :
                    <Button onClick={clickHandler} className="regBtn" variant="contained">sign up</Button>
            }
            <Paragraph className="navigatePage">Already  have an account ? <Link to="/">Sign In</Link></Paragraph>
        </div>
    </section>
  )
}

export default Registration