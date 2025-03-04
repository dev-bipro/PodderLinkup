import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, push, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [friendsRequestArr, setFriendsRequestArr] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const friendsRequestRef = ref(db, "friendsRequest");

    const unsubscribe = onValue(
      friendsRequestRef,
      (snapshot) => {
        const arr = [];
        snapshot.forEach((item) => {
          if (item.val().receiverId === logedinData.uid) {
            arr.push({ ...item.val(), key: item.key });
          }
        });
        setFriendsRequestArr(arr);
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

  const cancelFriendRequest = (item) => {
    remove(ref(db, "friendsRequest/" + item.key)).catch((error) =>
      setError(error.message)
    ); // Handle errors
  };

  const acceptFriendRequest = (item) => {
    set(push(ref(db, "friends")), {
      ...item,
    })
      .then(() => {
        return remove(ref(db, "friendsRequest/" + item.key));
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
      <Heading
        tagName="h3"
        className="userBoxHeading"
        title="Friend Requests"
      />
      <div className="usersBox">
        {friendsRequestArr.map((item) => (
          <Flex key={item.key} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image className="userImage" imageUrl={item.senderImage} />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={item.senderName}
                >
                  <Paragraph className="userTime" title="hahaha" />
                </Heading>
              </div>
            </Flex>
            <Flex className="friendsRequestBtnFlex">
              <Button
                onClick={() => acceptFriendRequest(item)}
                className="addFriendBtn"
                variant="contained"
              >
                Accept
              </Button>
              <Button
                onClick={() => cancelFriendRequest(item)}
                className="addFriendBtn"
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        ))}
      </div>
    </section>
  );
};

export default FriendRequest;
