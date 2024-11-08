import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Flex from "./Flex";
import Image from "./Image";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import GroupReqList from "./GroupReqList";
import GroupMemberList from "./GroupMemberList";

const MyGroup = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value);
  const [groupListArr, setGroupListArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reqIdGroup, setReqIdGroup] = useState("");
  const [reqOpen, setReqOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);

  useEffect(() => {
    const groupRef = ref(db, "groupList");

    const unsubscribe = onValue(groupRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (item.val().ownerId === logedinData.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupListArr(arr);
      setLoading(false); // Set loading to false once data is loaded
    });

    // Cleanup function to unsubscribe
    return () => unsubscribe();
  }, [db, logedinData.uid]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setReqOpen(false);
    setMemberOpen(false);
  };

  const requestGroupListOpenHandler = (item) => {
    setReqIdGroup(item);
    setReqOpen(true);
  };

  const memberGroupListOpenHandler = (item) => {
    setReqIdGroup(item);
    setMemberOpen(true);
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <>
      <div>
        <Modal
          open={reqOpen || memberOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {reqOpen ? (
              <GroupReqList groupReqId={reqIdGroup} />
            ) : (
              <GroupMemberList groupReqId={reqIdGroup} />
            )}
          </Box>
        </Modal>
      </div>
      <section id="userBox">
        <Heading
          tagName="h3"
          className="userBoxHeading"
          title="My Group List"
        />
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
                <Button
                  onClick={() => requestGroupListOpenHandler(item.key)}
                  className="addFriendBtn"
                  color="error"
                  variant="contained"
                >
                  Request List
                </Button>
                <Button
                  onClick={() => memberGroupListOpenHandler(item.key)}
                  className="addFriendBtn"
                  variant="contained"
                >
                  Member List
                </Button>
              </Flex>
            </Flex>
          ))}
        </div>
      </section>
    </>
  );
};

export default MyGroup;
