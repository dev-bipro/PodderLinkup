import { useEffect, useState } from 'react'
import Heading from '../Heading'
import { useDispatch, useSelector } from 'react-redux';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
// import { ref } from 'firebase/storage';
// import { useNavigate } from 'react-router-dom';
import Flex from '../Flex';
import Image from '../Image';
import Paragraph from '../Paragraph';
import { setActiveChat } from '../../features/activeChat/activeChat';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const ChatList = () => {
    const db = getDatabase();
    const dispatch = useDispatch();
    const logedinData = useSelector((state) => state.logedin.value);

    const [chatListArr, setChatListArr] = useState([]);
    const [groupMemberListArr, setGroupMemberListArr] = useState([]);
    const [groupListArr, setGroupListArr] = useState([]);

    // useEffect(()=>{
    //     onValue(ref(db, "groupMember"), (snapshot) => {
    //         const arr = [];
    //         snapshot.forEach((item) => {
    //             // console.log(item.val().senderId);
    //             if (item.val().memberId == logedinData.uid) {
    //                 arr.push(item.val().groupId)
    //             }
    //         })
    //         setGroupMemberListArr(arr);
    //         console.log(arr);
    //     })
    // },[])

    useEffect(() => {
        onValue(ref(db, "activeChat/" + logedinData.uid), (item) => {
            // console.log(item.val());
            dispatch(setActiveChat({ ...item.val() }))
        })
        onValue(ref(db, "friends"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                if (item.val().senderId == logedinData.uid) {
                    arr.push({
                        friendId: item.val().receiverId,
                        friendImage: item.val().receiverImage,
                        friendName: item.val().receiverName,
                        key: item.key
                    })
                }
                else if (item.val().receiverId == logedinData.uid) {
                    arr.push({
                        friendId: item.val().senderId,
                        friendImage: item.val().senderImage,
                        friendName: item.val().senderName,
                        key: item.key
                    })
                }
            })
            setChatListArr(arr)
        })
        onValue(ref(db, "groupMember"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                // console.log(item.val().senderId);
                if (item.val().memberId == logedinData.uid) {
                    arr.push(item.val().groupId)
                }
            })
            setGroupMemberListArr(arr);
            console.log(arr);
        })


        onValue(ref(db, "groupList"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                if (item.val().ownerId == logedinData.uid) {

                    arr.push({ ...item.val(), id: item.key })
                }
                // if (item.val().ownerId == logedinData.uid) {

                //     arr.push({ ...item.val(), id: item.key })
                // }

                // else if (groupMemberListArr.includes(item.key)) {

                //     arr.push({ ...item.val(), id: item.key })
                // }
                else if (groupMemberListArr.length != 0 && groupMemberListArr.includes(item.key)) {

                    arr.push({ ...item.val(), id: item.key })
                }
            })
            setGroupListArr(arr)
        })

    }, [])

    useEffect(() => {
        onValue(ref(db, "groupList"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                if (item.val().ownerId == logedinData.uid) {

                    arr.push({ ...item.val(), id: item.key })
                }
                // if (item.val().ownerId == logedinData.uid) {

                //     arr.push({ ...item.val(), id: item.key })
                // }

                // else if (groupMemberListArr.includes(item.key)) {

                //     arr.push({ ...item.val(), id: item.key })
                // }
                else if (groupMemberListArr.length != 0 && groupMemberListArr.includes(item.key)) {

                    arr.push({ ...item.val(), id: item.key })
                }
            })
            setGroupListArr(arr)
        })

    }, [groupMemberListArr])

    // console.log("memArr", groupMemberListArr);
    // console.log("groupArr", groupListArr);
    // console.log("groupArr", groupListArr);
    // console.log("groupArr", groupListArr);



    const activeChatHandler = (item) => {

        dispatch(setActiveChat({
            ...item,
            type: "single"
        }))
        set(ref(db, "activeChat/" + logedinData.uid), {
            ...item,
            type: "single"
        })
    }
    const activeGroupChatHandler = (item) => {

        dispatch(setActiveChat({
            ...item,
            type: "group"
        }))
        set(ref(db, "activeChat/" + logedinData.uid), {
            ...item,
            type: "group"
        })
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [groupNameInp, setGroupNameInp] = useState("");
    const createGroupHandler = () => {
        set(push(ref(db, "groupList")), {
            groupName: groupNameInp,
            ownerId: logedinData.uid,
            ownerName: logedinData.displayName,
            ownerImage: logedinData.photoURL,
            groupImage: "https://firebasestorage.googleapis.com/v0/b/podderlinkup.appspot.com/o/groupImage.avif?alt=media&token=fcf0cb30-cb07-4a98-9c45-91ac641fb1b3",
        }).then(() => {
            setGroupNameInp("");
            setOpen(false);
        })
    }



    console.log()
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
                        <Heading tagName="h2" className="updateNameHeading" title="create group" />
                        <TextField name='' onChange={(e) => setGroupNameInp(e.target.value)} type="text" className="regInput" id="outlined-basic" label="group name" value={groupNameInp} variant="outlined" />
                        <Button onClick={createGroupHandler} className="regBtn" variant="contained">create</Button>
                    </Box>
                </Modal>
            </div>
            <section id='chatList'>
                <Heading className="chatListBoxHeading" tagName="h3" title="chat list" />
                <div className="chatListBox">
                    {
                        chatListArr.map((item, index) => {
                            return (

                                <Flex onClick={() => activeChatHandler(item)} key={index} className="chatlistUser">
                                    <Flex className="userImageFlex">
                                        <div className="userImageDiv">
                                            <Image className="userImage" imageUrl={item.friendImage} />
                                        </div>
                                        <div className="userNameContent">
                                            <Heading tagName="h5" className="userName" title={item.friendName}>
                                                <Paragraph className="userTime" title="hahaha" />
                                            </Heading>
                                        </div>
                                    </Flex>
                                    {/* <Flex className="friendsRequestBtnFlex">
                                    <Button onClick={()=>blockFriend(item)} className="addFriendBtn" variant="contained">block</Button>
                                    <Button onClick={()=>cancelFriend(item)} className="addFriendBtn" color="error" variant="contained">delete</Button>

                                </Flex> */}

                                </Flex>
                            )
                        })
                    }
                </div>

                <Flex className="groupMainFlex">
                    <Heading tagName="h3" title="group list" />
                    <Button onClick={handleOpen} className="addFriendBtn" variant="contained">create</Button>
                </Flex>
                <div className="groupListBox">
                    {
                        groupListArr.map((item, index) => {
                            return (

                                <Flex onClick={() => activeGroupChatHandler(item)} key={index} className="chatlistUser">
                                    <Flex className="userImageFlex">
                                        <div className="userImageDiv">
                                            <Image className="userImage" imageUrl={item.groupImage} />
                                        </div>
                                        <div className="userNameContent">
                                            <Heading tagName="h5" className="userName" title={item.groupName}>
                                                <Paragraph className="userTime" title="hahaha" />
                                            </Heading>
                                        </div>
                                    </Flex>
                                    {/* <Flex className="friendsRequestBtnFlex">
                                    <Button onClick={()=>blockFriend(item)} className="addFriendBtn" variant="contained">block</Button>
                                    <Button onClick={()=>cancelFriend(item)} className="addFriendBtn" color="error" variant="contained">delete</Button>

                                </Flex> */}
                                    {
                                        item.ownerId == logedinData.uid ?
                                            <Button className="addFriendBtn" variant="contained" disabled >my group</Button>
                                            :
                                            null
                                    }
                                </Flex>
                            )
                        })
                    }
                </div>
            </section>
        </>
    )
}

export default ChatList