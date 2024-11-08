import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";

const GroupMemberList = ({ groupReqId }) => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [groupMemberListArr, setGroupMemberListArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupMemberRef = ref(db, "groupMember");

    const unsubscribe = onValue(groupMemberRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (item.val().groupId === groupReqId) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupMemberListArr(arr);
      setLoading(false); // Set loading to false after data is fetched
    });

    // Cleanup function to unsubscribe from Firebase
    return () => unsubscribe();
  }, [db, groupReqId]);

  const deleteGroupMemberHandler = (itemKey) => {
    remove(ref(db, `groupMember/${itemKey}`))
      .then(() => {
        console.log(`Member with key ${itemKey} removed successfully.`);
      })
      .catch((error) => {
        console.error("Error removing group member: ", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <section id="userBox">
      <Heading tagName="h3" className="userBoxHeading" title="Group Members" />
      <div className="usersBox">
        {groupMemberListArr.map((item) => (
          <Flex key={item.key} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image className="userImage" imageUrl={item.memberImage} />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={item.memberName}
                >
                  <Paragraph className="userTime" title="Active" />
                </Heading>
              </div>
            </Flex>
            <Flex className="friendsRequestBtnFlex">
              <Button
                onClick={() => deleteGroupMemberHandler(item.key)}
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

export default GroupMemberList;
