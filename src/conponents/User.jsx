import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { FaUserFriends } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";

const User = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [userArr, setUserArr] = useState([]);
  const [friendsRequestArr, setFriendsRequestArr] = useState([]);
  const [friendsArr, setFriendsArr] = useState([]);
  const [blockFriendsArr, setBlockFriendsArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "user");
    const friendsRequestRef = ref(db, "friendsRequest");
    const friendsRef = ref(db, "friends");
    const blockFriendsRef = ref(db, "blockFriends");

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (item.key !== logedinData.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setUserArr(arr);
    });

    const unsubscribeFriendsRequest = onValue(friendsRequestRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().senderId === logedinData.uid ||
          item.val().receiverId === logedinData.uid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriendsRequestArr(arr);
    });

    const unsubscribeFriends = onValue(friendsRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().receiverId === logedinData.uid ||
          item.val().senderId === logedinData.uid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriendsArr(arr);
    });

    const unsubscribeBlockFriends = onValue(blockFriendsRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().blockByID === logedinData.uid ||
          item.val().blockToID === logedinData.uid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setBlockFriendsArr(arr);
      setLoading(false); // Set loading to false once data is loaded
    });

    // Cleanup
    return () => {
      unsubscribeUsers();
      unsubscribeFriendsRequest();
      unsubscribeFriends();
      unsubscribeBlockFriends();
    };
  }, [db, logedinData.uid]);

  const sendFriendRequest = (item) => {
    set(push(ref(db, "friendsRequest")), {
      senderId: logedinData.uid,
      senderImage: logedinData.photoURL,
      senderName: logedinData.displayName,
      receiverId: item.key,
      receiverImage: item.photoURL,
      receiverName: item.fullName,
    });
  };

  const cancelFriendRequest = (item) => {
    friendsRequestArr.forEach((itm) => {
      if (itm.receiverId === item.key && logedinData.uid === itm.senderId) {
        remove(ref(db, "friendsRequest/" + itm.key));
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <section id="userBox">
      <Heading tagName="h3" className="userBoxHeading" title="User List" />
      <div className="usersBox">
        {userArr.map((item, index) => (
          <Flex key={index} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image className="userImage" imageUrl={item.photoURL} />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={item.fullName}
                >
                  <Paragraph className="userTime" title="hahaha" />
                </Heading>
              </div>
            </Flex>
            {friendsRequestArr.find((el) => el.receiverId === item.key) ? (
              <Button
                onClick={() => cancelFriendRequest(item)}
                className="addFriendBtn"
                variant="contained"
              >
                Cancel
              </Button>
            ) : friendsRequestArr.find((el) => el.senderId === item.key) ? (
              <Button className="addFriendBtn" variant="contained">
                Pending
              </Button>
            ) : friendsArr.find(
                (el) => el.senderId === item.key || el.receiverId === item.key
              ) ? (
              <FaUserFriends className="friendIcon" />
            ) : blockFriendsArr.find(
                (el) => el.blockByID === item.key || el.blockToID === item.key
              ) ? (
              <ImBlocked className="blockIcon" />
            ) : (
              <Button
                onClick={() => sendFriendRequest(item)}
                className="addFriendBtn"
                variant="contained"
              >
                Add Friend
              </Button>
            )}
          </Flex>
        ))}
      </div>
    </section>
  );
};

export default User;
