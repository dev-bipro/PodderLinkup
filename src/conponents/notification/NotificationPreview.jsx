import React, { useEffect, useState } from 'react'
import Flex from '../Flex'
import { MdDelete } from 'react-icons/md'
import { FcLike } from 'react-icons/fc'
import { FaEdit } from 'react-icons/fa'
import { BiSolidMessage, BiSolidMessageX, BiSolidSend, BiSolidMessageRoundedEdit } from 'react-icons/bi'
import { RiDislikeFill } from 'react-icons/ri'
import { ImFilePicture } from 'react-icons/im'
import { BsFillSendFill } from 'react-icons/bs'
import { MdDeleteForever } from 'react-icons/md'
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

const NotificationPreview = ({ postIdForPrev }) => {
    const db = getDatabase();
    const logedinData = useSelector((state) => state.logedin.value) ;

    const [post, setPost] = useState([]);
    const [postLikeArr, setPostLikeArr] = useState([]);
    const [postCommentsShow, setPostCommentsShow] = useState(false);
    const [postCommentArr, setPostCommentArr] = useState([]);
    const [commentInpValue, setCommentInpValue] = useState("") ;
    const [forEditCommentValue, setForEditCommentValue] = useState(null) ;


    useEffect(() => {
        onValue(ref(db, "post/" + postIdForPrev), (snapshot) => {
            setPost({ ...snapshot.val(), key: snapshot.key });
            // console.log(snapshot.val()) ;
            // setPostArr(arr.reverse())
        })
        onValue(ref(db, "postLike"), (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (item.val().postId == postIdForPrev) {

                    arr.push({ ...item.val(), key: item.key });
                }
            })
            setPostLikeArr(arr)
        })
        onValue(ref(db, "comments"), (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (item.val().commentTo == postIdForPrev) {

                    arr.push({ ...item.val(), key: item.key });
                }
            })
            setPostCommentArr(arr)
        })
    }, [postIdForPrev])

    // postIdForPrev



    const likeHandler = ()=>{
        set(push(ref(db,"postLike")),{
            postId: post.key,
            whoPost: post.postBy,
            whoLike: logedinData.uid,
            whoLikeName: logedinData.displayName,
            whoLikeImage: logedinData.photoURL,
        }).then(()=>{
            update(ref(db,"post/"+postIdForPrev),{
                likeNumber: post.likeNumber ? (post.likeNumber+1) : (0+1)

            })
        })
    }
    const unlikeHandler = ()=>{
        // let delLikeId = "" ;
        postLikeArr.map((item)=>{
            if (item.whoLike == logedinData.uid) {

                remove(ref(db,"postLike/"+item.key)).then(()=>{
                    update(ref(db,"post/"+postIdForPrev),{
                        likeNumber: (post.likeNumber-1)
        
                    })
                })
            }
        })

    }
    
    const commentChangeHandler = (e)=>{
        setCommentInpValue(e.target.value) ;
    }
    
    const addCommentHandler = ()=>{
        if (commentInpValue && !forEditCommentValue) {
            
            set(push(ref(db, "comments")),{
                commentBy: logedinData.uid,
                commentByImage: logedinData.photoURL,
                commentByName: logedinData.displayName,
                postBy: post.postBy,
                postByImage: post.postByImage,
                postByName: post.postByName,
                commentTo: post.key,
                commentText: commentInpValue,
                commentDate:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
            }).then(()=>{
                update(ref(db,"post/"+ postIdForPrev),{
                    commentsNumber: post.commentsNumber ? (post.commentsNumber+1) : (0+1)
                    
                }).then(()=>{
                    setCommentInpValue("") ;
                })
            })
        }
        else if (forEditCommentValue) {
            update(ref(db, "comments/"+forEditCommentValue.key),{
                commentText: commentInpValue,
            }).then(()=>{
                setCommentInpValue("") ;
                setForEditCommentValue(null)
            })
        }
    }
    const deleteComment = (commentKey)=>{
        remove(ref(db,"comments/"+commentKey)).then(()=>{
            update(ref(db,"post/"+postIdForPrev),{
                commentsNumber: (post.commentsNumber-1)

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
            <div className="prevNotiPostBox" >
                <div className="PostContent">

                    <Flex className="whoPost">
                        <div className="postPofilePicDiv">
                            <Image className="postProfilePic" imageUrl={post.postByImage} />
                        </div>
                        <div className="postPofileNameDiv">
                            <Heading tagName="h4" className="postBy" title={post.postByName}>
                                <Paragraph className="postTime" title={`post by ${moment(post.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                            </Heading>
                        </div>
                    </Flex>

                    {
                        post.text &&
                        <Paragraph title={post.text} />
                    }
                    {
                        post.image &&
                        <div className="newPostPrevewImageDiv">
                            <Image className="newPostPrevewImage" imageUrl={post.image} />
                        </div>
                    }
                    {
                        post.video &&
                        <div className="PostPrevewVideoDiv">
                            <video width="100%" controls>
                                <source src={post.video} type="video/mp4" />
                            </video>
                        </div>
                    }
                    <div className="postFooter">

                        <Flex className="postLikeCommentBtns">

                            <Flex className="unlikeBtns">
                                {
                                    postLikeArr.find((el) => el.whoLike == logedinData.uid && el.postId == post.key) ?

                                        <div onClick={unlikeHandler} className="likeBtn">
                                            <FcLike />
                                        </div>
                                        :
                                        <div onClick={likeHandler} className="unlikeBtn">
                                            <RiDislikeFill />
                                        </div>
                                }
                                <Paragraph className="likeNumber">{post.likeNumber ? post.likeNumber + (post.likeNumber <= 1 ? "    Like" : "   likes") : ""}</Paragraph>
                            </Flex>
                            {
                                postCommentsShow ?

                                    <div onClick={() => setPostCommentsShow(false)} className="unlikeBtn"><BiSolidMessageX /></div>


                                    :

                                    <div onClick={() => setPostCommentsShow(true)} className="unlikeBtn"><BiSolidMessage /></div>

                            }
                            <Paragraph className="commentsNumber">{post.commentsNumber ? post.commentsNumber + (post.commentsNumber <= 1 ? "    comment" : "   comments") : ""}</Paragraph>
                        </Flex>
                    </div>

                </div>

                {
                    postCommentsShow &&

                    <div className="commentBox">
                        <Flex className="commentInpFlex">
                            <div className="addCommentInp">
                                <TextField onChange={commentChangeHandler} name='comment' type="text" className="regInput" id="outlined-basic" label="Type Your Comment" variant="outlined" value={commentInpValue} />
                            </div>
                            <Button onClick={addCommentHandler} className="newPostBtn"><BiSolidSend /></Button>
                        </Flex>

                        {
                            postCommentArr.map((commentItem, commentIndex) => {
                                return (

                                    <div key={commentIndex} className="singleBoxComment">
                                        <Flex className="commentHead">
                                            <Flex className="commentHeadContent">
                                                <div className="commentPicDiv">
                                                    <Image className="commentPic" imageUrl={commentItem.commentByImage} />
                                                </div>
                                                <div className="comentHeading">
                                                    <Heading className="whoComment" tagName="h4" title={commentItem.commentByName}>
                                                        <Paragraph className="commentTime" title={`${moment(commentItem.commentDate, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                                    </Heading>
                                                </div>
                                            </Flex>
                                            <Flex className="commentHeadContent">
                                                {
                                                    commentItem.commentBy == logedinData.uid ?
                                                        <>
                                                            <div className="editComment" title="Edit Comment">
                                                                <BiSolidMessageRoundedEdit onClick={() => forEditComment(commentItem)} />
                                                            </div>
                                                            <div className="deleteComment" title="Delete Comment">
                                                                <MdDeleteForever onClick={() => deleteComment(commentItem.key)} />
                                                            </div>
                                                        </>
                                                        : commentItem.postBy == logedinData.uid &&
                                                        <div className="deleteComment" title="Delete Comment">
                                                            <MdDeleteForever onClick={() => deleteComment(commentItem.key)} />
                                                        </div>

                                                }
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

            </div>
        </>
    )
}

export default NotificationPreview