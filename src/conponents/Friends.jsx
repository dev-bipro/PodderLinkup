import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, push, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";

const Friends = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [friendsArr, setFriendsArr] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const friendsRef = ref(db, "friends");

    const unsubscribe = onValue(
      friendsRef,
      (snapshot) => {
        const arr = [];
        snapshot.forEach((item) => {
          const data = item.val();
          if (
            data.receiverId === logedinData.uid ||
            data.senderId === logedinData.uid
          ) {
            arr.push({ ...data, key: item.key });
          }
        });
        setFriendsArr(arr);
        setLoading(false); // Set loading to false after data is fetched
      },
      (error) => {
        setError(error.message); // Handle errors
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [db, logedinData.uid]);

  const cancelFriend = (item) => {
    remove(ref(db, "friends/" + item.key)).catch((error) =>
      setError(error.message)
    ); // Handle errors
  };

  const blockFriend = (item) => {
    const blockByID =
      item.receiverId === logedinData.uid ? item.receiverId : item.senderId;
    const blockToID =
      item.receiverId === logedinData.uid ? item.senderId : item.receiverId;

    set(push(ref(db, "blockFriends")), {
      blockByID,
      blockByImage:
        item.receiverId === logedinData.uid
          ? item.receiverImage
          : item.senderImage,
      blockByName:
        item.receiverId === logedinData.uid
          ? item.receiverName
          : item.senderName,
      blockToID,
      blockToImage:
        item.receiverId === logedinData.uid
          ? item.senderImage
          : item.receiverImage,
      blockToName:
        item.receiverId === logedinData.uid
          ? item.senderName
          : item.receiverName,
    })
      .then(() => {
        return remove(ref(db, "friends/" + item.key));
      })
      .catch((error) => setError(error.message)); // Handle errors
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  if (error) {
    return <p>Error: {error}</p>; // Display error message
  }

  return (
    <section id="userBox">
      <Heading tagName="h3" className="userBoxHeading" title="Friend List" />
      <div className="usersBox">
        {friendsArr.map((item) => (
          <Flex key={item.key} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image
                  className="userImage"
                  imageUrl={
                    item.receiverId === logedinData.uid
                      ? item.senderImage
                      : item.receiverImage
                  }
                />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={
                    item.receiverId === logedinData.uid
                      ? item.senderName
                      : item.receiverName
                  }
                >
                  <Paragraph className="userTime" title="hahaha" />
                </Heading>
              </div>
            </Flex>
            <Flex className="friendsRequestBtnFlex">
              <Button
                onClick={() => blockFriend(item)}
                className="addFriendBtn"
                variant="contained"
              >
                Block
              </Button>
              <Button
                onClick={() => cancelFriend(item)}
                className="addFriendBtn"
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </Flex>
          </Flex>
        ))}
      </div>
    </section>
  );
};

export default Friends;
