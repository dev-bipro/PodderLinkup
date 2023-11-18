import React, { useEffect, useState } from 'react'
import Image from '../../../conponents/Image'
import myLogo from '../../../assets/myLogoLikeLinkdin.svg'
import Heading from '../../../conponents/Heading'
import Paragraph from '../../../conponents/Paragraph'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import Alert from '@mui/material/Alert';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FallingLines } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { setLogedIn } from '../../../features/logdin/whoLogedin'


const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate() ;
    const dispatch = useDispatch() ;
    const logedinData = useSelector((state)=> state.logedin.value) ;
    useEffect(()=>{
        if (logedinData) {
            navigate("/home")
        }
    },[])
    // console.log(logedinData);

    const [formData, setFormData] = useState({
        email:"",
        password:""
    })
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordShow, setPasswordShow] = useState(false)
    const [load,setLoad] = useState(true)
    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
        if (e.target.name == "email") {
            setEmailError("")
        }
        else if (e.target.name == "password") {
            setPasswordError("")
        }
    }
    const clickHandler = () => {

        if (!formData.email) {
            setEmailError("please type your email !")
        }
        if (!formData.password) {
            setPasswordError("please type your password !")
        }
        if (formData.email && formData.password) {

            const validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;


            if (!validEmail.test(formData.email)) {
                setEmailError("type a validmail")
            }
            if (formData.password.length < 6) {
                setPasswordError("type password min 6 letter's")
            }
            if (validEmail.test(formData.email) && formData.password.length > 5) {
                setLoad(false) ;
                setTimeout(()=>{
                    setLoad(true)
                    signInWithEmailAndPassword(auth, formData.email, formData.password)
                    .then((user) => {
                        // Signed in 
                        console.log(user.user);
                        if (!user.user.emailVerified){
                            toast.error('🦄 please verified your gmail !', {
                                position: "top-left",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                        }else {
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
                                localStorage.setItem('user',JSON.stringify(user.user)) ;
                                dispatch(setLogedIn(user.user))
                                navigate("/home")
                            },6000)
                        }
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorMessage);
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
            <Heading tagName="h1" className="regHeading" title="free register and you can enjoy it" />

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
                    <Button onClick={clickHandler} className="regBtn" variant="contained">sign in</Button>
            }
            <Paragraph className="navigatePage">You Have No Account ? <Link to="/registration">Sign Up</Link></Paragraph>
        </div>
    </section>
  )
}

export default Login