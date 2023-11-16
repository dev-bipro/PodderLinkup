import React, { useEffect, useState } from 'react'
import Flex from '../Flex'
import {MdDelete} from 'react-icons/md'
import {FcLike} from 'react-icons/fc'
import {FaEdit} from 'react-icons/fa'
import {BiSolidMessage, BiSolidMessageX, BiSolidSend, BiSolidMessageRoundedEdit} from 'react-icons/bi'
import {RiDislikeFill} from 'react-icons/ri'
import {ImFilePicture} from 'react-icons/im'
import {BsFillSendFill} from 'react-icons/bs'
import {MdDeleteForever} from 'react-icons/md'
import Heading from '../Heading'
import Image from '../Image'
import { deleteObject, getDownloadURL, getStorage, ref as storRef, uploadBytes } from 'firebase/storage'
import { useSelector } from 'react-redux'
import { getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database'
import Paragraph from '../Paragraph'
import moment from 'moment/moment'
import { Button, TextField } from '@mui/material'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const Post = () => {
    const db = getDatabase() ;
    const storage = getStorage() ;
    const logedinData = useSelector((state) => state.logedin.value) ;
    const postLike = useSelector((state) => state.logedin.value) ;


    const [inpValue, setInpValue] = useState("") ;
    const [inpImage, setInpImage] = useState(null) ;
    const [inpVideo, setInpVideo] = useState(null) ;
    const [forEditData, setForEditData] = useState(null) ;

    const [postArr, setPostArr] = useState([]) ;
    const [postLikeArr, setPostLikeArr] = useState([]) ;
    const [postCommentsShow, setPostCommentsShow] = useState("") ;
    const [postCommentArr, setPostCommentArr] = useState([]) ;
    const [commentArr, setCommentArr] = useState([]) ;

    const [commentInpValue, setCommentInpValue] = useState("") ;
    const [forEditCommentValue, setForEditCommentValue] = useState(null) ;

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);


    useEffect(()=>{
        onValue(ref(db, "post"),(snapshot)=>{
            let arr = [] ;
            snapshot.forEach((item)=>{
                    arr.push({...item.val(),key:item.key}) ;
            })
            setPostArr(arr.reverse())
        })
        onValue(ref(db, "postLike"),(snapshot)=>{
            let arr = [] ;
            snapshot.forEach((item)=>{
                    arr.push({...item.val(),key:item.key}) ;
            })
            setPostLikeArr(arr)
        })
        onValue(ref(db, "comments"),(snapshot)=>{
            let arr = [] ;
            snapshot.forEach((item)=>{
                arr.push({...item.val(),key:item.key}) ;
            })
            setCommentArr(arr)
        })
    },[])
    useEffect(()=>{
        onValue(ref(db, "comments"),(snapshot)=>{
            let arr = [] ;
            snapshot.forEach((item)=>{
                if (item.val().commentTo == postCommentsShow) {

                    arr.push({...item.val(),key:item.key}) ;
                }
            })
            setPostCommentArr(arr)
        })
    },[postCommentsShow])

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


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

    const editPostOpenHandler = (item) =>{

        setForEditData({
            ...item
        })
        
        setOpen(true) ;
    }

    const deletePostHandler = (item) =>{

        if (item.text && item.image && item.video) {
            remove(ref(db,"post/" + item.key)).then(()=>{
                deleteObject(storRef(storage,item.imageId)).then(() => {
                    deleteObject(storRef(storage,item.videoId)).then(()=>{
                        postLikeArr.map((itm)=>{
                            if (item.key == itm.postId) {
                                remove(ref(db, "postLike/" + itm.key))
                            }
                        })

                        commentArr.map((commentItem)=>{
                            if (item.key == commentItem.commentTo) {
                                remove(ref(db, "comments/" + commentItem.key))
                            }
                        })
                    })
                })
            })
        }
        else{
            if (item.image && item.video) {
                remove(ref(db,"post/" + item.key)).then(()=>{
                    deleteObject(storRef(storage,item.imageId)).then(() => {
                        deleteObject(storRef(storage,item.videoId)).then(()=>{
                            postLikeArr.map((itm)=>{
                                if (item.key == itm.postId) {
                                    remove(ref(db, "postLike/" + itm.key))
                                }
                            })
    
                            commentArr.map((commentItem)=>{
                                if (item.key == commentItem.commentTo) {
                                    remove(ref(db, "comments/" + commentItem.key))
                                }
                            })
                        })
                    })
                })
            }
            else if (item.text && item.image) {
                remove(ref(db,"post/" + item.key)).then(()=>{
                    deleteObject(storRef(storage,item.imageId)).then(()=>{
                        postLikeArr.map((itm)=>{
                            if (item.key == itm.postId) {
                                remove(ref(db, "postLike/" + itm.key))
                            }
                        })

                        commentArr.map((commentItem)=>{
                            if (item.key == commentItem.commentTo) {
                                remove(ref(db, "comments/" + commentItem.key))
                            }
                        })
                    })
                })
            }
            else if (item.text && item.video) {
                remove(ref(db,"post/" + item.key)).then(()=>{
                    deleteObject(storRef(storage,item.videoId)).then(()=>{
                        postLikeArr.map((itm)=>{
                            if (item.key == itm.postId) {
                                remove(ref(db, "postLike/" + itm.key))
                            }
                        })

                        commentArr.map((commentItem)=>{
                            if (item.key == commentItem.commentTo) {
                                remove(ref(db, "comments/" + commentItem.key))
                            }
                        })
                    })
                })
            }
            else{

                if (item.video) {
                    remove(ref(db,"post/" + item.key)).then(()=>{
                        deleteObject(storRef(storage,item.videoId)).then(()=>{
                            postLikeArr.map((itm)=>{
                                if (item.key == itm.postId) {
                                    remove(ref(db, "postLike/" + itm.key))
                                }
                            })
    
                            commentArr.map((commentItem)=>{
                                if (item.key == commentItem.commentTo) {
                                    remove(ref(db, "comments/" + commentItem.key))
                                }
                            })
                        })
                    })
                }
                else if (item.image) {
                    remove(ref(db,"post/" + item.key)).then(()=>{
                        deleteObject(storRef(storage,item.imageId)).then(()=>{
                            postLikeArr.map((itm)=>{
                                if (item.key == itm.postId) {
                                    remove(ref(db, "postLike/" + itm.key))
                                }
                            })
    
                            commentArr.map((commentItem)=>{
                                if (item.key == commentItem.commentTo) {
                                    remove(ref(db, "comments/" + commentItem.key))
                                }
                            })
                        })
                    })
                }
                else if (item.text) {
                    remove(ref(db,"post/" + item.key)).then(()=>{
                        postLikeArr.map((itm)=>{
                            if (item.key == itm.postId) {
                                remove(ref(db, "postLike/" + itm.key))
                            }
                        })

                        commentArr.map((commentItem)=>{
                            if (item.key == commentItem.commentTo) {
                                remove(ref(db, "comments/" + commentItem.key))
                            }
                        })
                    })
                }
            }
        }
    }
    const editPostHandler = () =>{

        if (inpValue && inpImage && inpVideo) {
            const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo?.name + Date.now());
            const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage?.name + Date.now());

            uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                    
                    uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                        getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                            update(ref(db, "post/"+forEditData.key),{
                                ...forEditData,
                                videoId:videoSnapshot.metadata.fullPath,
                                video:videoUrl,
                                imageId:imageSnapshot.metadata.fullPath,
                                image:imageUrl,
                                text:inpValue,
                                date:forEditData.date
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
                const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo?.name + Date.now());
                const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage?.name + Date.now());

                uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                    getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                        
                        uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                            getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:videoSnapshot.metadata.fullPath,
                                    video:videoUrl,
                                    imageId:imageSnapshot.metadata.fullPath,
                                    image:imageUrl,
                                    text:"",
                                    date:forEditData.date
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
                const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo ? inpVideo.name + Date.now() : "");
                const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage ? inpImage.name + Date.now() : "");

                if (forEditData.videoId) {
                    deleteObject(videoStorageRef).then(()=>{
                        uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                            getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:"",
                                    video:"",
                                    imageId:imageSnapshot.metadata.fullPath,
                                    image:imageUrl,
                                    text:inpValue,
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpValue("") ;
                                    setInpImage(null) ;
                                })
                            })
                        })
                    })
                }
                else{

                    uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                        getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                            update(ref(db, "post/"+forEditData.key),{
                                ...forEditData,
                                videoId:"",
                                video:"",
                                imageId:imageSnapshot.metadata.fullPath,
                                image:imageUrl,
                                text:inpValue,
                                date:forEditData.date
                            }).then(()=>{
                                setInpValue("") ;
                                setInpImage(null) ;
                            })
                        })
                    });
                }

                
            }
            else if (inpValue && inpVideo) {
                const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo ? inpVideo.name + Date.now() : "");
                const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage ? inpImage.name + Date.now() : "");

                if (forEditData.imageId) {
                    deleteObject(imageStorageRef).then(()=>{
                        uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                            getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:videoSnapshot.metadata.fullPath,
                                    video:videoUrl,
                                    imageId:"",
                                    image:"",
                                    text:inpValue,
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpValue("") ;
                                    setInpVideo(null) ;
                                })
                            })
                        })
                    })
                }
                else{


                    uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                        getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                            update(ref(db, "post/"+forEditData.key),{
                                ...forEditData,
                                videoId:videoSnapshot.metadata.fullPath,
                                video:videoUrl,
                                imageId:"",
                                image:"",
                                text:inpValue,
                                date:forEditData.date
                            }).then(()=>{
                                setInpValue("") ;
                                setInpVideo(null) ;
                            })
                        })
                    })
                }

            }
            else{

                if (inpVideo) {

                    const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo ? inpVideo.name + Date.now() : "");
                    const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage ? inpImage.name + Date.now() : "");

                    if (forEditData.imageId) {
                        deleteObject(imageStorageRef).then(()=>{
                            uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                                getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                                    update(ref(db, "post/"+forEditData.key),{
                                        ...forEditData,
                                        videoId:videoSnapshot.metadata.fullPath,
                                        video:videoUrl,
                                        imageId:"",
                                        image:"",
                                        text:"",
                                        date:forEditData.date
                                    }).then(()=>{
                                        setInpVideo(null) ;
                                    })
                                })
                            })
                        })
                    }
                    else{
    
    
                        uploadBytes(videoStorageRef, inpVideo).then((videoSnapshot) => {
                            getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:videoSnapshot.metadata.fullPath,
                                    video:videoUrl,
                                    imageId:"",
                                    image:"",
                                    text:"",
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpValue("") ;
                                    setInpVideo(null) ;
                                })
                            })
                        })
                    }
                }
                else if (inpImage) {
                    const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo ? inpVideo.name + Date.now() : "");
                    const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage ? inpImage.name + Date.now() : "");
    
                    if (forEditData.videoId) {
                        deleteObject(videoStorageRef).then(()=>{
                            uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                                getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                                    update(ref(db, "post/"+forEditData.key),{
                                        ...forEditData,
                                        videoId:"",
                                        video:"",
                                        imageId:imageSnapshot.metadata.fullPath,
                                        image:imageUrl,
                                        text:"",
                                        date:forEditData.date
                                    }).then(()=>{
                                        setInpImage(null) ;
                                    })
                                })
                            })
                        })
                    }
                    else{
    
                        uploadBytes(imageStorageRef, inpImage).then((imageSnapshot) => {
                            getDownloadURL(storRef(storage, imageSnapshot.metadata.fullPath)).then((imageUrl) => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:"",
                                    video:"",
                                    imageId:imageSnapshot.metadata.fullPath,
                                    image:imageUrl,
                                    text:"",
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpImage(null) ;
                                })
                            })
                        });
                    }
                }
                else if (inpValue) {
                    const videoStorageRef = storRef(storage, forEditData.videoId? forEditData.videoId : inpVideo ? inpVideo.name + Date.now() : "");
                    const imageStorageRef = storRef(storage, forEditData.imageId? forEditData.imageId : inpImage ? inpImage.name + Date.now() : "");
    
                    if (forEditData.videoId && forEditData.imageId) {
                        deleteObject(videoStorageRef).then(()=>{
                            deleteObject(imageStorageRef).then(() => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:"",
                                    video:"",
                                    imageId:"",
                                    image:"",
                                    text:inpValue,
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpValue("") ;
                                })
                            })
                        })
                    }
                    else{
                        if (forEditData.videoId) {
                            deleteObject(videoStorageRef).then(()=>{
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:"",
                                    video:"",
                                    imageId:"",
                                    image:"",
                                    text:inpValue,
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpValue("") ;
                                })
                            })
                        }
                        else if (forEditData.imageId) {
                            deleteObject(imageStorageRef).then(() => {
                                update(ref(db, "post/"+forEditData.key),{
                                    ...forEditData,
                                    videoId:"",
                                    video:"",
                                    imageId:"",
                                    image:"",
                                    text:inpValue,
                                    date:forEditData.date
                                }).then(()=>{
                                    setInpValue("") ;
                                })
                            })
                        }
                        else {
                            update(ref(db, "post/"+forEditData.key),{
                                ...forEditData,
                                videoId:"",
                                video:"",
                                imageId:"",
                                image:"",
                                text:inpValue,
                                date:forEditData.date
                            }).then(()=>{
                                setInpValue("") ;
                            })
                        }
                    }

                }
            }
        }
        setOpen(false) ;
    }

    const likeHandler = (item)=>{
        set(push(ref(db,"postLike")),{
            postId: item.key,
            whoPost: item.postBy,
            whoLike: logedinData.uid,
            whoLikeName: logedinData.displayName,
            whoLikeImage: logedinData.photoURL,
        }).then(()=>{
            update(ref(db,"post/"+item.key),{
                ...item,
                likeNumber: item.likeNumber ? (item.likeNumber+1) : (0+1)

            })
        })
    }
    const unlikeHandler = (item)=>{
        // let delLikeId = "" ;
        postLikeArr.map((itm)=>{
            if (item.key == itm.postId && itm.whoLike == logedinData.uid) {

                remove(ref(db,"postLike/"+itm.key)).then(()=>{
                    update(ref(db,"post/"+item.key),{
                        ...item,
                        likeNumber: (item.likeNumber-1)
        
                    })
                })
            }
        })

    }
    
    const commentChangeHandler = (e)=>{
        setCommentInpValue(e.target.value) ;
    }
    
    const addCommentHandler = (item)=>{
        if (commentInpValue && !forEditCommentValue) {
            
            set(push(ref(db, "comments")),{
                commentBy: logedinData.uid,
                commentByImage: logedinData.photoURL,
                commentByName: logedinData.displayName,
                postBy: item.postBy,
                postByImage: item.postByImage,
                postByName: item.postByName,
                commentTo: item.key,
                commentText: commentInpValue,
                commentDate:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
            }).then(()=>{
                update(ref(db,"post/"+item.key),{
                    ...item,
                    commentsNumber: item.commentsNumber ? (item.commentsNumber+1) : (0+1)
                    
                }).then(()=>{
                    setCommentInpValue("") ;
                })
            })
        }
        else if (forEditCommentValue) {
            update(ref(db, "comments/"+forEditCommentValue.key),{
                ...forEditCommentValue,
                commentText: commentInpValue,
            }).then(()=>{
                setCommentInpValue("") ;
                setForEditCommentValue(null)
            })
        }
    }
    const deleteComment = (commentKey,postItem)=>{
        remove(ref(db,"comments/"+commentKey)).then(()=>{
            update(ref(db,"post/"+postItem.key),{
                ...postItem,
                commentsNumber: (postItem.commentsNumber-1)

            })
        })

    }
    const forEditComment = (item)=>{
        setForEditCommentValue({
            ...item
        })
        setCommentInpValue(item.commentText)

    }
    

  return (

    <>
         <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="newPostContent">
                        <Heading tagName="h3" className="newPostHeading" title="edit your post" />
                        <Flex className="newPostInputFlex">
                            {/* <input onChange={changeHandler} name="newPostTextInp" className="newPostInput" type="text" placeholder="What’s on your mind?" value={inpValue} /> */}
                            <textarea onChange={changeHandler} name="newPostTextInp" className="newPostInput" type="text" placeholder="What’s on your mind?" value={inpValue} cols="30" rows="10" />
                            <Flex className="newPostBtnFlex">
                                <label className="newPostPicBtnDiv">
                                    <ImFilePicture className="newPostPicBtn" />
                                    <input onChange={changeHandler} name="imageAndVideoInp" style={{display:"none"}} type="file" accept="image/*, video/*" />
                                </label>
                                <Button onClick={editPostHandler} className="newPostBtn"><BsFillSendFill /></Button>
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
                </Box>
            </Modal>
        </div>
        {
            postArr.map((item, index)=>{
                return (
                    
                    <>
                        <div key={index} className="PostContent">
                            <Flex className="postCtrlBtnDiv" title="add new post">
                                {
                                    item.postBy == logedinData.uid &&
                                        <Flex className="postEditDelBtns">
                                            <div>
                                                <FaEdit onClick={()=>editPostOpenHandler(item)} title="Edit Your Post" className="postEditBtn" />
                                            </div>
                                            <div>
                                                <MdDelete onClick={()=>deletePostHandler(item)} title="Delete Your Post" className="postDelBtn" />
                                            </div>
                                        </Flex>
                                }
                            </Flex>
                            <Flex className="whoPost">
                                <div className="postPofilePicDiv">
                                    <Image className="postProfilePic" imageUrl={item.postByImage} />
                                </div>
                                <div className="postPofileNameDiv">
                                    <Heading tagName="h4" className="postBy" title={item.postByName}>
                                        <Paragraph className="postTime" title={`post by ${moment(item.date,"YYYYMMDD h:mm:ss").fromNow()}`} />
                                    </Heading>
                                </div>
                            </Flex>

                            {
                                item.text &&
                                    <Paragraph title={item.text}/>
                            }
                            {
                                item.image &&
                                <div className="newPostPrevewImageDiv">
                                    <Image className="newPostPrevewImage" imageUrl={item.image} />
                                </div>
                            }
                            {
                                item.video &&
                                    <div className="PostPrevewVideoDiv">
                                        <video width="100%" controls>
                                            <source src={item.video} type="video/mp4" />
                                        </video>
                                    </div>
                            }
                            <div className="postFooter">

                                <Flex className="postLikeCommentBtns">

                                    <Flex className="unlikeBtns">
                                        {
                                            postLikeArr.find((el)=> el.whoLike == logedinData.uid && el.postId == item.key) ?
                                            
                                                <div onClick={()=>unlikeHandler(item)} className="likeBtn">
                                                    <FcLike />
                                                </div>
                                            :
                                                <div onClick={()=>likeHandler(item)} className="unlikeBtn">
                                                    <RiDislikeFill />
                                                </div>
                                        }
                                        <Paragraph className="likeNumber">{item.likeNumber ? item.likeNumber + (item.likeNumber <= 1 ? "    Like" : "   likes") : ""}</Paragraph>
                                    </Flex>
                                        {
                                            postCommentsShow == item.key ?
                                                    
                                                <div onClick={()=>setPostCommentsShow("")} className="unlikeBtn"><BiSolidMessageX /></div>
                                                    
                                                
                                            :
                                                
                                                <div onClick={()=>setPostCommentsShow(item.key)} className="unlikeBtn"><BiSolidMessage /></div>
                                                
                                        }
                                        <Paragraph className="commentsNumber">{item.commentsNumber ? item.commentsNumber + (item.commentsNumber <= 1 ? "    comment" : "   comments") : ""}</Paragraph>
                                </Flex>
                            </div>
                            
                        </div>

                        {
                            postCommentsShow == item.key &&

                                <div className="commentBox">
                                    <Flex className="commentInpFlex">
                                        <div className="addCommentInp">
                                            <TextField onChange={commentChangeHandler} name='comment' type="text" className="regInput" id="outlined-basic" label="Type Your Comment" variant="outlined" value={commentInpValue} />
                                        </div>
                                        <Button onClick={()=>addCommentHandler(item)} className="newPostBtn"><BiSolidSend /></Button>
                                    </Flex>

                                    {
                                        postCommentArr.map((commentItem, commentIndex)=>{
                                            return (

                                                <div key={commentIndex} className="singleBoxComment">
                                                    <Flex className="commentHead">
                                                        <Flex className="commentHeadContent">
                                                            <div className="commentPicDiv">
                                                                <Image className="commentPic" imageUrl={commentItem.commentByImage} />
                                                            </div>
                                                            <div className="comentHeading">
                                                                <Heading className="whoComment" tagName="h4" title={commentItem.commentByName}>
                                                                    <Paragraph className="commentTime" title={`${moment(commentItem.commentDate,"YYYYMMDD h:mm:ss").fromNow()}`} />
                                                                </Heading>
                                                            </div>
                                                        </Flex>
                                                        <Flex className="commentHeadContent">
                                                            <div className="editComment" title="Edit Comment">
                                                                <BiSolidMessageRoundedEdit onClick={()=>forEditComment(commentItem)} />
                                                            </div>
                                                            <div className="deleteComment" title="Delete Comment">
                                                                <MdDeleteForever onClick={()=>deleteComment(commentItem.key,item)} />
                                                            </div>
                                                        </Flex>
                                                    </Flex>
                                                    <div className="commentTextDiv">
                                                        <Paragraph className="commentText" title={commentItem.commentText} />
                                                    </div>
                                                </div>

                                                // <h1>{commentItem.commentByName}</h1>
                                            )
                                        })
                                    }
                                </div>
                        }

                    </>
                )

            })
        }
    </>
  )
}

export default Post