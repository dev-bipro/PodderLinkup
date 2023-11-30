import React, { useEffect, useRef, useState } from 'react'
import Flex from '../Flex'
import Image from '../Image'
import Heading from '../Heading'
import Paragraph from '../Paragraph'
import { MdCall } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { ImFilePicture } from "react-icons/im";
import { BsFillSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { getDatabase, onValue, push, ref, set } from 'firebase/database'
import { uploadBytes, ref as storRef, getStorage, getDownloadURL, } from 'firebase/storage';
import moment from 'moment/moment';
import EmojiPicker from 'emoji-picker-react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const MessagesBox = () => {
    const db = getDatabase();
    const storage = getStorage();
    const chatNow = useSelector((state) => state.whoActiveChat.activeChatValue);
    const logedinData = useSelector((state) => state.logedin.value);



    const [messagesValue, setMessagesValue] = useState("");
    const [auidoMessagesValue, setAudioMessagesValue] = useState(null);
    const [emojiShow, setEmojiShow] = useState(false);
    const [messagesArr, setMessagesArr] = useState([]);
    const smsInputRef = useRef();



    useEffect(() => {
        onValue(ref(db, "messages"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                if ((item.val().receiveId == logedinData.uid && item.val().senderId == chatNow.friendId) || (item.val().senderId == logedinData.uid && item.val().receiveId == chatNow.friendId)) {
                    arr.push({ ...item.val(), key: item.key })
                }
            })
            setMessagesArr(arr)
        })
        // console.log(messagesArr);
    }, [])
    useEffect(() => {
        onValue(ref(db, "messages"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                if ((item.val().receiveId == logedinData.uid && item.val().senderId == chatNow.friendId) || (item.val().senderId == logedinData.uid && item.val().receiveId == chatNow.friendId)) {
                    arr.push({ ...item.val(), key: item.key })
                }
            })
            setMessagesArr(arr)
        })
        // console.log(messagesArr);
    }, chatNow?.friendId)


    const changeHandler = (e) => {
        if (e.target.name == "imageAndVideoInp") {

            if (e.target.files[0].type.includes("image")) {
                const imageStorageRef = storRef(storage, e.target.files[0].name + Date.now());

                uploadBytes(imageStorageRef, e.target.files[0]).then((snapshot) => {
                    getDownloadURL(storRef(storage, snapshot.metadata.fullPath)).then((imageUrl) => {

                        set(push(ref(db, "messages")), {
                            receiveId: chatNow.friendId,
                            senderId: logedinData.uid,
                            imageMessage: imageUrl,
                            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                        })
                    })
                })
                // getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
            };
            // console.log(e.target.files[0].type);
            if (e.target.files[0].type.includes("video")) {
                const videoStorageRef = storRef(storage, e.target.files[0].name + Date.now());

                uploadBytes(videoStorageRef, e.target.files[0]).then((snapshot) => {
                    getDownloadURL(storRef(storage, snapshot.metadata.fullPath)).then((videoUrl) => {

                        set(push(ref(db, "messages")), {
                            receiveId: chatNow.friendId,
                            senderId: logedinData.uid,
                            videoMessage: videoUrl,
                            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                        })
                    })
                })
                // getDownloadURL(storRef(storage, videoSnapshot.metadata.fullPath)).then((videoUrl) => {
            };
        } else {
            setMessagesValue(e.target.value);
        }
    }
    const clickHandler = () => {
        set(push(ref(db, "messages")), {
            receiveId: chatNow.friendId,
            senderId: logedinData.uid,
            textMessage: messagesValue,
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        }).then(() => {
            setMessagesValue("");
        })
    }
    const emojiClick = (e) => {
        // console.log(smsInputRef.current.selectionStart);
        // console.log(messagesValue.substring(0, smsInputRef.current.selectionStart));
        smsInputRef.current.focus()
        const smsPartOne = messagesValue.substring(0, smsInputRef.current.selectionStart)
        const smsPartTwo = messagesValue.substring(smsInputRef.current.selectionStart)
        const sms = smsPartOne + e.emoji + smsPartTwo;

        setMessagesValue(sms)
    }
    const recorderControls = useAudioRecorder()
    const addAudioElement = (blob) => {
        // const url = URL.createObjectURL(blob);
        // const audio = document.createElement("audio");
        // audio.src = url;
        // audio.controls = true;
        console.log(blob);
        setAudioMessagesValue(blob);
        //   document.body.appendChild(audio);
    };
    const sendAudio = ()=>{
        const audioStorageRef = storRef(storage, "audio" + Date.now());

                uploadBytes(audioStorageRef, auidoMessagesValue).then((snapshot) => {
                    getDownloadURL(storRef(storage, snapshot.metadata.fullPath)).then((audioUrl) => {

                        set(push(ref(db, "messages")), {
                            receiveId: chatNow.friendId,
                            senderId: logedinData.uid,
                            audioMessage: audioUrl,
                            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                        }).then(()=>{

                            setAudioMessagesValue(null)
                        })
                    })
                })
    }

    return (
        <section id="messagesBox">
            <Flex className="messagesBoxHedder">
                <Flex className="messageBoxImageName">
                    <div className="messageBoxImageDiv">
                        <Image className="messageBoxImage" imageUrl={chatNow?.friendImage} />
                    </div>
                    <div className="activeChatNameDiv">
                        <Heading tagName="h3" className="activeChatName" title={chatNow?.friendName}>
                            <Paragraph className="onlineOfline" title="active" />
                        </Heading>
                    </div>
                </Flex>
                <Flex className="messagesBoxIconDiv">
                    <div className="chatBoxAudioCallDtiv">
                        <MdCall />
                    </div>
                    <div className="chatBoxVideoCallDtiv">
                        <FaVideo />
                    </div>
                    <div className="chatBoxVideoCallDtiv"></div>
                </Flex>
            </Flex>
            <div className="messageBox">
                {
                    messagesArr.map((messageItem, messageIndex) => {
                        if (messageItem.senderId == logedinData.uid) {
                            return (
                                // {
                                messageItem.textMessage ?
                                    <div className="sendTextSmsDiv">
                                        <Paragraph className="sendTextSms" title={messageItem.textMessage} />
                                        <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                    </div>
                                    // <h1>{messageItem.textMessage}</h1>
                                    : messageItem.imageMessage ?
                                        <div className="sendImageSmsDiv">
                                            <div className="sendImageSms">
                                                <Image className="imageSms" imageUrl={messageItem.imageMessage} />
                                            </div>
                                            <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                        </div>
                                        : messageItem.videoMessage ?
                                            <div className="sendVideoSmsDiv">
                                                <div className="sendVideoSms">
                                                    <video width="100%" controls>
                                                        <source src={messageItem.videoMessage} type="video/mp4" />
                                                    </video>
                                                </div>
                                                <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                            </div>
                                            : messageItem.audioMessage ?
                                            <div className="sendTextSmsDiv">
                                                <div className="sendTextSms">
                                                    <audio width="100%" controls>
                                                        <source src={messageItem.audioMessage} type="audio/ogg" />
                                                    </audio>
                                                </div>
                                                <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                            </div>
                                            : ""
                                // }
                            )
                        }
                        else {
                            return (
                                messageItem.textMessage ?
                                    <div className="receiveTextSmsDiv">
                                        <Paragraph className="receiveTextSms" title={messageItem.textMessage} />
                                        <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                    </div>
                                    // <h1>{messageItem.textMessage}</h1>
                                    : messageItem.imageMessage ?
                                        <div className="receiveImageSmsDiv">
                                            <div className="receiveImageSms">
                                                <Image className="imageSms" imageUrl={messageItem.imageMessage} />
                                            </div>
                                            <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                        </div>
                                        : messageItem.audioMessage ?
                                        <div className="receiveTextSmsDiv">
                                            <div className="receiveTextSms">
                                                <audio width="100%" controls>
                                                    <source src={messageItem.audioMessage} type="audio/ogg" />
                                                </audio>
                                            </div>
                                            <Paragraph className="smsTime" title={`${moment(messageItem.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                        </div>
                                        : ""
                            )
                        }
                    })
                }
            </div>
            <Flex className="sendSmsInputFlex">
                {/* <input onChange={changeHandler} name="newPostTextInp" className="newPostInput" type="text" placeholder="What’s on your mind?" value={inpValue} /> */}
                {
                    !auidoMessagesValue ?
                        <textarea ref={smsInputRef} onChange={changeHandler} name="newPostTextInp" className="newSendSmsInput" type="text" placeholder="Type Your Message" cols="10" rows="5" value={messagesValue} />
                    :
                        <Flex className="voiceShowFlex">
                            <audio controls>
                                <source src={URL.createObjectURL(auidoMessagesValue)} type="audio/ogg" />
                            </audio>
                            <button className="voiceDelBtn" onClick={()=>setAudioMessagesValue(null)}>delete</button>
                            <button className="voiceSendBtn" onClick={sendAudio}>send</button>
                        </Flex>
                }
                <Flex className="newPostBtnFlex">
                    <label className="newPostPicBtnDiv">
                        <ImFilePicture className="newPostPicBtn" />
                        <input onChange={changeHandler} name="imageAndVideoInp" style={{ display: "none" }} type="file" accept="image/*, video/*" />
                    </label>
                    {
                        !auidoMessagesValue &&

                            <AudioRecorder
                                onRecordingComplete={addAudioElement}
                                audioTrackConstraints={{
                                    noiseSuppression: true,
                                    echoCancellation: true,
                                }}

                                
                                downloadOnSavePress={false}
                                downloadFileExtension="webm"
                            />
                    }
                    <Button onClick={clickHandler} className="newPostBtn"><BsFillSendFill /></Button>
                    <div className="imojiLogo">
                        <MdEmojiEmotions className="emojiPickerLogo" onClick={() => setEmojiShow(!emojiShow)} />

                    </div>
                    {
                        emojiShow &&
                        <div className="emojiPicker">
                            <EmojiPicker onEmojiClick={emojiClick} />
                        </div>
                    }
                </Flex>
            </Flex>
        </section>
    )
}

export default MessagesBox