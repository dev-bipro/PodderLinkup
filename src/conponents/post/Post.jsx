import React, { useEffect, useState } from 'react'
import Flex from '../Flex'
import {MdDelete} from 'react-icons/md'
import {FcLike} from 'react-icons/fc'
import {BiSolidMessage, BiSolidSend} from 'react-icons/bi'
import {RiDislikeFill} from 'react-icons/ri'
import Heading from '../Heading'
import Image from '../Image'
import { deleteObject, getDownloadURL, getStorage, ref as storRef, uploadBytes } from 'firebase/storage'
import { useSelector } from 'react-redux'
import { getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database'
import Paragraph from '../Paragraph'
import moment from 'moment/moment'
import { Button, TextField } from '@mui/material'

const Post = () => {
    const db = getDatabase() ;
    const storage = getStorage() ;
    const logedinData = useSelector((state) => state.logedin.value) ;
    const postLike = useSelector((state) => state.logedin.value) ;

    const [postArr, setPostArr] = useState([]) ;
    const [postLikeArr, setPostLikeArr] = useState([]) ;


    useEffect(()=>{
        onValue(ref(db, "post"),(snapshot)=>{
            let arr = [] ;
            snapshot.forEach((item)=>{
                    arr.push({...item.val(),key:item.key}) ;
            })
            setPostArr(arr)
        })
        onValue(ref(db, "postLike"),(snapshot)=>{
            let arr = [] ;
            snapshot.forEach((item)=>{
                    arr.push({...item.val(),key:item.key}) ;
            })
            setPostLikeArr(arr)
        })
    },[])
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
                    })
                }
            }
        }
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
  return (
    postArr.reverse().map((item, index)=>{
        return (
            
            <>
                <div key={index} className="PostContent">
                    <Flex className="postCtrlBtnDiv" title="add new post">
                        {
                            item.postBy == logedinData.uid &&
                                <MdDelete onClick={()=>deletePostHandler(item)} className="postCtrlBtn" />
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
                                <Paragraph className="likeNumber">{item.likeNumber ? item.likeNumber + (item.likeNumber == 1 ? "    Like" : "   likes") : ""}</Paragraph>
                            </Flex>
                            <Flex className="unlikeBtns">
                                <div onClick={()=>unlikeHandler(item)} className="unlikeBtn"><BiSolidMessage /></div>
                                
                                <Paragraph className="likeNumber">{item.likeNumber ? item.likeNumber + (item.likeNumber == 1 ? "    Like" : "   likes") : ""}</Paragraph>
                            </Flex>
                        </Flex>
                    </div>
                    
                </div>
                <div className="commentBox">
                    <Flex className="commentInpFlex">
                        <div className="addCommentInp">
                            <TextField name='comment' type="text" className="regInput" id="outlined-basic" label="Type Your Comment" variant="outlined" />
                        </div>
                        <Button className="newPostBtn"><BiSolidSend /></Button>
                    </Flex>
                </div>
            </>
        )

    })
  )
}

export default Post