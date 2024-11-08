import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, push, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";

const BlockFriends = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [blockFriendsArr, setBlockFriendsArr] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const blockFriendsRef = ref(db, "blockFriends");

    const unsubscribe = onValue(
      blockFriendsRef,
      (snapshot) => {
        const arr = [];
        snapshot.forEach((item) => {
          if (item.val().blockByID === logedinData.uid) {
            arr.push({ ...item.val(), key: item.key });
          }
        });
        setBlockFriendsArr(arr);
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

  const unblockFriendHandler = (item) => {
    set(push(ref(db, "friends")), {
      receiverId: item.blockByID,
      receiverImage: item.blockByImage,
      receiverName: item.blockByName,
      senderId: item.blockToID,
      senderImage: item.blockToImage,
      senderName: item.blockToName,
    })
      .then(() => {
        return remove(ref(db, "blockFriends/" + item.key));
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
      <Heading tagName="h3" className="userBoxHeading" title="Blocked List" />
      <div className="usersBox">
        {blockFriendsArr.map((item) => (
          <Flex key={item.key} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image className="userImage" imageUrl={item.blockToImage} />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={item.blockToName}
                >
                  <Paragraph className="userTime" title="hahaha" />
                </Heading>
              </div>
            </Flex>
            <Button
              onClick={() => unblockFriendHandler(item)}
              className="addFriendBtn"
              variant="contained"
            >
              Unblock
            </Button>
          </Flex>
        ))}
      </div>
    </section>
  );
};

export default BlockFriends;
