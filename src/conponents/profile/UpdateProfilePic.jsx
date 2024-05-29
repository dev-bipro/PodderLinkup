import React, { useState, createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Heading from "../Heading";
import { Button } from "@mui/material";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref as RDRef, update } from "firebase/database";
import { setLogedIn } from "../../features/logdin/whoLogedin";

const UpdateProfilePic = () => {

    const logedinData = useSelector(state => state.logedin.value);

    const auth = getAuth();
    const db = getDatabase();
    const storage = getStorage();
    const dispatch = useDispatch();
    const storageRef = ref(storage, `profilePic${logedinData.uid}`);
    console.log(auth);

    const defaultSrc = "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
    const [image, setImage] = useState(defaultSrc);
    const [cropData, setCropData] = useState("#");
    const cropperRef = createRef();
    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                getDownloadURL(ref(storage, snapshot.metadata.fullPath)).then((url) => {
                    // console.log(url);
                    updateProfile(auth.currentUser, {
                        photoURL: url
                    }).then(() => {
                        update(RDRef(db, `user/${logedinData.uid}`),{
                            photoURL:url,
                        }).then(()=>{
                            localStorage.setItem('user',JSON.stringify(auth.currentUser)) ;
                            dispatch(setLogedIn(auth.currentUser))
                        })
                    })
                })
            });
        }
    };
    return (
        <div>
            <Heading tagName="h2" title="Preview" />
            <div className="img-preview"></div>
            <div style={{ width: "100%" }}>
                <input accept="image/*" type="file" onChange={onChange} />
                <br />
                <br />
                <Heading tagName="h2" title="Crop" />
                <br />
                <Cropper
                    ref={cropperRef}
                    style={{ height: 400, width: "100%" }}
                    zoomTo={0.5}
                    aspectRatio={9 / 9}
                    // initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    guides={true}
                />
            </div>

            <Button onClick={getCropData} className="contactInfoBtn" style={{ marginTop: "10px" }} variant="contained">upload</Button>

            {/* <br style={{ clear: "both" }} /> */}
        </div>
    )
}

export default UpdateProfilePic