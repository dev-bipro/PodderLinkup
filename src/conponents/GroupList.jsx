import { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";

const GroupList = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [groupListArr, setGroupListArr] = useState([]);
  const [groupReqListArr, setGroupReqListArr] = useState([]);
  const [groupMemberListArr, setGroupMemberListArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupListRef = ref(db, "groupList");
    const groupRequestRef = ref(db, "groupRequest");
    const groupMemberRef = ref(db, "groupMember");

    const fetchData = () => {
      const groupListPromise = onValue(groupListRef, (snapshot) => {
        const arr = [];
        snapshot.forEach((item) => {
          if (item.val().ownerId !== logedinData.uid) {
            arr.push({ ...item.val(), key: item.key });
          }
        });
        setGroupListArr(arr);
      });

      const groupReqPromise = onValue(groupRequestRef, (snapshot) => {
        const arr = [];
        snapshot.forEach((item) => {
          arr.push({ ...item.val(), key: item.key });
        });
        setGroupReqListArr(arr);
      });

      const groupMemberPromise = onValue(groupMemberRef, (snapshot) => {
        const arr = [];
        snapshot.forEach((item) => {
          arr.push({ ...item.val(), key: item.key });
        });
        setGroupMemberListArr(arr);
      });

      // Wait for all the promises to resolve
      Promise.all([groupListPromise, groupReqPromise, groupMemberPromise]).then(
        () => {
          setLoading(false); // Set loading to false after data is fetched
        }
      );
    };

    fetchData();

    // Cleanup on unmount
    return () => {
      // You can clean up listeners here if needed
    };
  }, [db, logedinData.uid]);

  const joinGroupHandler = (item) => {
    set(ref(db, `groupRequest/${item.key}${logedinData.uid}`), {
      groupId: item.key,
      requestFromId: logedinData.uid,
      requestFromImage: logedinData.photoURL,
      requestFromName: logedinData.displayName,
    });
  };

  const cancelGroupReqHandler = (item) => {
    const reqToCancel = groupReqListArr.find(
      (el) => el.requestFromId === logedinData.uid && el.groupId === item.key
    );
    if (reqToCancel) {
      remove(ref(db, `groupRequest/${reqToCancel.key}`));
    }
  };

  const exitGroupReqHandler = (item) => {
    const memberToExit = groupMemberListArr.find(
      (el) => el.groupId === item.key && el.memberId === logedinData.uid
    );
    if (memberToExit) {
      remove(ref(db, `groupMember/${memberToExit.key}`));
    }
  };

  const renderActionButton = (item) => {
    if (
      groupReqListArr.find(
        (el) => el.requestFromId === logedinData.uid && el.groupId === item.key
      )
    ) {
      return (
        <Button
          onClick={() => cancelGroupReqHandler(item)}
          className="addFriendBtn"
          color="error"
          variant="contained"
        >
          Cancel
        </Button>
      );
    }

    if (
      groupMemberListArr.find(
        (el) => el.memberId === logedinData.uid && el.groupId === item.key
      )
    ) {
      return (
        <Button
          onClick={() => exitGroupReqHandler(item)}
          className="addFriendBtn"
          color="error"
          variant="contained"
        >
          Exit ❌
        </Button>
      );
    }

    return (
      <Button
        onClick={() => joinGroupHandler(item)}
        className="addFriendBtn"
        variant="contained"
      >
        Join
      </Button>
    );
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <section id="userBox">
      <Heading tagName="h3" className="userBoxHeading" title="Group List" />
      <div className="usersBox">
        {groupListArr.map((item) => (
          <Flex key={item.key} className="user">
            <Flex className="userImageFlex">
              <div className="userImageDiv">
                <Image className="userImage" imageUrl={item.groupImage} />
              </div>
              <div className="userNameContent">
                <Heading
                  tagName="h5"
                  className="userName"
                  title={item.groupName}
                >
                  <Paragraph className="userTime" title="hahaha" />
                </Heading>
              </div>
            </Flex>
            <Flex className="friendsRequestBtnFlex">
              {renderActionButton(item)}
            </Flex>
          </Flex>
        ))}
      </div>
    </section>
  );
};

export default GroupList;
