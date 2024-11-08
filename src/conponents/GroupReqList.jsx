import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";

const GroupReqList = ({ groupReqId }) => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [groupReqListArr, setGroupReqListArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupRequestRef = ref(db, "groupRequest");

    const unsubscribe = onValue(groupRequestRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (item.val().groupId === groupReqId) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupReqListArr(arr);
      setLoading(false); // Set loading to false after data is fetched
    });

    // Cleanup function to unsubscribe from Firebase
    return () => unsubscribe();
  }, [db, groupReqId]);

  const acceptGroupHandler = (item) => {
    set(ref(db, `groupMember/${item.key}_${logedinData.uid}`), {
      groupId: item.groupId,
      memberId: item.requestFromId,
      memberImage: item.requestFromImage,
      memberName: item.requestFromName,
    })
      .then(() => {
        remove(ref(db, `groupRequest/${item.key}`));
      })
      .catch((error) => {
        console.error("Error accepting group request: ", error);
      });
  };

  const deleteGroupReqHandler = (itemKey) => {
    remove(ref(db, `groupRequest/${itemKey}`)).catch((error) => {
      console.error("Error deleting group request: ", error);
    });
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <section id="userBox">
      <Heading tagName="h3" className="userBoxHeading" title="Group Requests" />
      <div className="usersBox">
        {groupReqListArr.map((item) => (
          <Flex key={item.key} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image className="userImage" imageUrl={item.requestFromImage} />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={item.requestFromName}
                >
                  <Paragraph className="userTime" title="Requested" />
                </Heading>
              </div>
            </Flex>
            <Flex className="friendsRequestBtnFlex">
              <Button
                onClick={() => acceptGroupHandler(item)}
                className="addFriendBtn"
                variant="contained"
              >
                Accept
              </Button>
              <Button
                onClick={() => deleteGroupReqHandler(item.key)}
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

export default GroupReqList;
