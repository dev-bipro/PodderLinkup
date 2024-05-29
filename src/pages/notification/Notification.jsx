import React, { useEffect, useState } from 'react'
import './Notification.css'
import Container from '../../conponents/Container'
import Heading from '../../conponents/Heading'
import Image from '../../conponents/Image'
import { useSelector } from 'react-redux'
import Paragraph from '../../conponents/Paragraph'
import { getDatabase, onValue, ref } from 'firebase/database'
import moment from 'moment/moment';
import Flex from '../../conponents/Flex'
import NotificationPreview from '../../conponents/notification/NotificationPreview'

const Notification = () => {

    const db = getDatabase();

    const logedinData = useSelector(state => state.logedin.value);


    const [newNotification, setNewNotification] = useState([]);
    const [notiPrevShow, setNotiPrevShow] = useState("");
    useEffect(() => {
        onValue(ref(db, "newNotification"), (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                console.log(item.val());
                if (item.val().postBy != logedinData.uid) {
                    arr.push({ ...item.val(), id: item.key })
                }
            })
            setNewNotification(arr.reverse());
        })
    }, [])
    return (
        <section>
            <Container>
                <div className="notificationContent">
                    <Heading tagName="h2" className="notiHeading" title="notification's" />
                    <Flex className="notiMainFlex">
                        <div className="notifications">
                            {
                                newNotification.map((item, index) => {

                                    return (

                                        <div key={index} onClick={()=> setNotiPrevShow(item.id)} className="notificationBox">
                                            <div className="notificationByImage">
                                                <Image className="notiImage" imageUrl={item.postByImage} />
                                            </div>
                                            <div className="notiDtls">
                                                <Heading tagName="h3" className="notiName" title={item.postByName} />
                                                <Paragraph className="notiSms" title={item.notiSms} />
                                            </div>
                                            <Paragraph title={`${moment(item.date, "YYYYMMDD h:mm:ss").fromNow()}`} />
                                        </div>
                                    )

                                })
                            }
                        </div>
                        <div className="notiContentPrevDiv">
                            {
                                notiPrevShow &&

                                    <NotificationPreview postIdForPrev={notiPrevShow} />
                            }
                        </div>

                    </Flex>
                </div>
            </Container>
        </section>
    )
}

export default Notification