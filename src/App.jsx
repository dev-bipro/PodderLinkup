import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Login />} />
        <Route element={<RootLayout/>} >

          <Route path="/home" element={<Home/>} />
          <Route path="/me" element={<MyProfile/>} />

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
