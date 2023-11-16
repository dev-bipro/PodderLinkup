import React, {useState } from 'react'
import Container from '../Container'
import Heading from '../Heading'
import Flex from '../Flex'
import {ImFilePicture} from 'react-icons/im'
import {BsFillSendFill} from 'react-icons/bs'
import {Button } from '@mui/material'
import Image from '../Image'
import { getDownloadURL, getStorage, ref as storRef, uploadBytes } from 'firebase/storage'
import { useSelector } from 'react-redux'
import { getDatabase, push, ref, set } from 'firebase/database'
import Post from './Post'

const NewPost = () => {
    const storage = getStorage() ;
    const db = getDatabase() ;
    const logedinData = useSelector((state) => state.logedin.value) ;
    const [inpValue, setInpValue] = useState("") ;
    const [inpImage, setInpImage] = useState(null) ;
    const [inpVideo, setInpVideo] = useState(null) ;
    
    // const [imagePreview, setImagePreview] = useState(null);

    const changeHandler = (e) =>{
        
        if (e.target.name == "imageAndVideoInp") {
            if (e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png") {
                setInpImage(e.target.files[0])
            }
            else{
                setInpVideo(e.target.files[0])
            }
        }
        else{
            setInpValue(e.target.value)
        }
    }
    const clickHandler = () =>{

        const idForPost = `postid${Date.now()}` ;
        console.log(idForPost);

        if (inpValue && inpImage && inpVideo) {
            const videoStorageRef = storRef(storage, inpVideo?.name + Date.now());
            const imageStorageRef = storRef(storage, inpImage?.name + Date.now());

            uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                    
                    uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                        getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                            set(ref(db, "post/"+idForPost),{
                                postBy:logedinData.uid,
                                postByName:logedinData.displayName,
                                postByImage:logedinData.photoURL,
                                videoId:videoSnapshot.metadata.fullPath,
                                video:videoUrl,
                                imageId:imageSnapshot.metadata.fullPath,
                                image:imageUrl,
                                text:inpValue,
                                date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                            }).then(()=>{
                                setInpValue("") ;
                                setInpImage(null) ;
                                setInpVideo(null) ;
                            })
                        })
                    });
                })
            });
        }
        else{
            if (inpImage && inpVideo) {
                const videoStorageRef = storRef(storage, inpVideo?.name + Date.now());
                const imageStorageRef = storRef(storage, inpImage?.name + Date.now());

                uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                    getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                        
                        uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                            getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                                set(ref(db, "post/"+idForPost),{
                                    postBy:logedinData.uid,
                                    postByName:logedinData.displayName,
                                    postByImage:logedinData.photoURL,
                                    videoId:videoSnapshot.metadata.fullPath,
                                    video:videoUrl,
                                    imageId:imageSnapshot.metadata.fullPath,
                                    image:imageUrl,
                                    date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                                }).then(()=>{
                                    setInpImage(null) ;
                                    setInpVideo(null) ;
                                })
                            })
                        });
                    })
                });
            }
            else if (inpValue && inpImage) {
                const imageStorageRef = storRef(storage, inpImage?.name + Date.now());
                
                uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                    getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                        set(ref(db, "post/"+idForPost),{
                            postBy:logedinData.uid,
                            postByName:logedinData.displayName,
                            postByImage:logedinData.photoURL,
                            imageId:imageSnapshot.metadata.fullPath,
                            image:imageUrl,
                            text:inpValue,
                            date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                        }).then(()=>{
                            setInpValue("") ;
                            setInpImage(null) ;
                        })
                    })
                });
            }
            else if (inpValue && inpVideo) {
                const videoStorageRef = storRef(storage, inpVideo?.name + Date.now());

                uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                    getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                        set(ref(db, "post/"+idForPost),{
                            postBy:logedinData.uid,
                            postByName:logedinData.displayName,
                            postByImage:logedinData.photoURL,
                            videoId:videoSnapshot.metadata.fullPath,
                            video:videoUrl,
                            text:inpValue,
                            date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                        }).then(()=>{
                            setInpValue("") ;
                            setInpVideo(null) ;
                        })
                    })
                });
            }
            else{

                if (inpVideo) {
                    const videoStorageRef = storRef(storage, inpVideo?.name + Date.now());

                    uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                        getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                            set(ref(db, "post/"+idForPost),{
                                postBy:logedinData.uid,
                                postByName:logedinData.displayName,
                                postByImage:logedinData.photoURL,
                                videoId:videoSnapshot.metadata.fullPath,
                                video:videoUrl,
                                date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                            }).then(()=>{
                                setInpVideo(null) ;
                            })
                        })
                    });
                }
                else if (inpImage) {
                    const imageStorageRef = storRef(storage, inpImage?.name + Date.now());
                    uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                        getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                            set(ref(db, "post/"+idForPost),{
                                postBy:logedinData.uid,
                                postByName:logedinData.displayName,
                                postByImage:logedinData.photoURL,
                                imageId:imageSnapshot.metadata.fullPath,
                                image:imageUrl,
                                date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                            }).then(()=>{
                                setInpImage(null) ;
                            })
                        })
                    });
                }
                else if (inpValue) {
                    set(ref(db, "post/"+idForPost),{
                        postBy:logedinData.uid,
                        postByName:logedinData.displayName,
                        postByImage:logedinData.photoURL,
                        text:inpValue,
                        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                    }).then(()=>{
                        setInpValue("") ;
                    })
                }
            }
        }
    }
  return (
    <>
        <section id="newPost">
            <Container>
                <div className="newPostContent">
                    <Heading tagName="h3" className="newPostHeading" title="add new post" />
                    <Flex className="newPostInputFlex">
                        {/* <input onChange={changeHandler} name="newPostTextInp" className="newPostInput" type="text" placeholder="What’s on your mind?" value={inpValue} /> */}
                        <textarea onChange={changeHandler} name="newPostTextInp" className="newPostInput" type="text" placeholder="What’s on your mind?" value={inpValue} cols="30" rows="10" />
                        <Flex className="newPostBtnFlex">
                            <label className="newPostPicBtnDiv">
                                <ImFilePicture className="newPostPicBtn" />
                                <input onChange={changeHandler} name="imageAndVideoInp" style={{display:"none"}} type="file" accept="image/*, video/*" />
                            </label>
                            <Button onClick={clickHandler} className="newPostBtn"><BsFillSendFill /></Button>
                        </Flex>
                    </Flex>
                    {
                        inpImage&&
                        <div className="newPostPrevewImageDiv">
                            <Image className="newPostPrevewImage" imageUrl={URL.createObjectURL(inpImage)} />
                        </div>
                    }
                    {
                        inpVideo&&
                            <div className="newPostPrevewVideoDiv">
                                <video width="100%" controls>
                                    <source src={URL.createObjectURL(inpVideo)} type="video/mp4" />
                                </video>
                            </div>
                    }
                </div>
            </Container>
        </section>
        <section id="post">
            <Container>
                <Post />
            </Container>
        </section>
    </>
  )
}

export default NewPost