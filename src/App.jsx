import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";
import Login from './pages/authentication/login/Login';
import Registration from './pages/authentication/registration/Registration';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/home/Home';
import MyProfile from './pages/profile/MyProfile';
import RootLayout from './conponents/layout/RootLayout';
import Messages from './pages/messages/Messages';
import Notification from './pages/notification/Notification';
// import { getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database'
// import { useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';

function App() {

  // const logedinData = useSelector((state) => state.logedin.value);
  // const db = getDatabase();



  // const [alertNoti, setAlertNoti] = useState([]);
  // const [postListArr, setPostListArr] = useState([]);
  // const [notiSeenArr, setNotiSeenArr] = useState([]);


  // useEffect(() => {
  //   onValue(ref(db, "newNotification"), (snapshot) => {
  //     const arr = [];
  //     snapshot.forEach(item => {
  //       arr.push({ ...item.val(), id: item.key });
  //     })
  //     setAlertNoti(arr)
  //   })
  //   onValue(ref(db, "post"), (snapshot) => {
  //     const arr = [];
  //     snapshot.forEach(item => {
  //       arr.push({ ...item.val(), id: item.key });
  //     })
  //     setPostListArr(arr)
  //   })
  //   onValue(ref(db, "seenNotification"), (snapshot) => {
  //     const arr = [];
  //     snapshot.forEach(item => {
  //       arr.push({ ...item.val(), id: item.key });
  //     })
  //     setNotiSeenArr(arr)
  //   })



  //   // alertNoti.map((item, index) => {

  //   //   const notiCon = notiSeenArr.filter((el) => el.id == (item.id+logedinData.uid))
  //   //   // const notiCon = notiSeenArr.filter((el) => item.id == (el.id-logedinData.uid))
  //   //   console.log(notiCon.length);
  //   //   // console.log(notiSeenArr.find((el) => Boolean(el.id != (item.id-logedinData.uid))));
  //   //   // console.log(notiSeenArr.includes((el) => (el.id != (item.id-logedinData.uid))));
  
  //   //   if (notiCon.length == 0) {
  //   //     console.log(notiCon);
  //   //     toast.info(`🦄 ${item.postByName} ${item.notiSms}`, {
  //   //       position: "top-center",
  //   //       autoClose: 5000,
  //   //       hideProgressBar: false,
  //   //       closeOnClick: true,
  //   //       pauseOnHover: true,
  //   //       draggable: true,
  //   //       progress: undefined,
  //   //       theme: "colored",
  //   //     })
  //   //       set(ref(db, "seenNotification/" + item.id+logedinData.uid), {
  //   //         postId : item.id
  //   //       })
  //   //     // })
  //   //   }
  //   // })
  // }, [])




  
  // useEffect(() => {
  //   onValue(ref(db, "seenNotification"), (snapshot) => {
  //     const arr = [];
  //     snapshot.forEach(item => {
  //       arr.push({ ...item.val(), id: item.key });
  //     })
  //     setNotiSeenArr(arr)
  //   })
    
  //   // alertNoti.map((item, index) => {

  //   //   const notiCon = notiSeenArr.filter((el) => el.id == (item.id+logedinData.uid))
  //   //   // const notiCon = notiSeenArr.filter((el) => item.id == (el.id-logedinData.uid))
  //   //   console.log(notiCon.length);
  //   //   // console.log(notiSeenArr.find((el) => Boolean(el.id != (item.id-logedinData.uid))));
  //   //   // console.log(notiSeenArr.includes((el) => (el.id != (item.id-logedinData.uid))));
  
  //   //   if (notiCon.length == 0) {
  //   //     console.log(notiCon);
  //   //     toast.info(`🦄 ${item.postByName} ${item.notiSms}`, {
  //   //       position: "top-center",
  //   //       autoClose: 5000,
  //   //       hideProgressBar: false,
  //   //       closeOnClick: true,
  //   //       pauseOnHover: true,
  //   //       draggable: true,
  //   //       progress: undefined,
  //   //       theme: "colored",
  //   //     })
  //   //       set(ref(db, "seenNotification/" + item.id+logedinData.uid), {
  //   //         postId : item.id
  //   //       })
  //   //     // })
  //   //   }
  //   // })
  // }, [postListArr.length])

  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Login />} />
        <Route element={<RootLayout />} >

          <Route path="/home" element={<Home />} />
          <Route path="/me" element={<MyProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notification" element={<Notification />} />

        </Route>

      </Route>
    )
  );



  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
