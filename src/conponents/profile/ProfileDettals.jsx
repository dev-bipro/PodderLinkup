import React, { useEffect, useRef, useState } from 'react'
import Container from '../Container'
import Flex from '../Flex'
import Heading from '../Heading'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Alert, Button, TextField } from '@mui/material'
import { getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database'
import { getDownloadURL, getStorage, ref as imageRef, uploadBytes, deleteObject } from 'firebase/storage'
import { useSelector } from 'react-redux';
import Paragraph from '../Paragraph';
import {AiOutlineEdit} from 'react-icons/ai'
import {RiDeleteBin6Line} from 'react-icons/ri'
import Image from '../Image';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const ProfileDettals = () => {
    const logedinData = useSelector((state) => state.logedin.value)
    const db = getDatabase() ;        
    const storage = getStorage();


    useEffect(()=>{
        onValue(ref(db, "profileAbout/" + logedinData.uid),(snapshot)=>{
            setAboutText(snapshot.val().about)
        })
        onValue(ref(db, "profileExperience"),(snapshot)=>{
            const arr = [] ;

            snapshot.forEach((item)=>{
                if (item.val().ownerId == logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                };
            })
            setExperienceArr(arr);
        })
        onValue(ref(db, "educationDetalls"),(snapshot)=>{
            const arr = [] ;

            snapshot.forEach((item)=>{
                if (item.val().ownerId == logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                };
            })
            setEducationArr(arr);
        })
    },[])

  // modal part start
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "600px",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const handleClose = () => {
      setAddAboutOpen(false);
      setEditAboutModalOpen(false);
      setAddExperienceModalOpen(false);
      setExperienceEditModalOpen(false);
      setAddEducationModalOpen(false);
      setEducationEditModalOpen(false);
      
      setAboutInputValue("") ;
    }
  // modal part end

  // about part start

  const [addAboutOpen, setAddAboutOpen] = useState(false);
  const [editAboutModalOpen, setEditAboutModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState("") ;
  const [aboutTextShow, setAboutTextShow] = useState(false) ;
  const [aboutInputValue, setAboutInputValue] = useState("");
  const aboutChangeHandler = (e)=>{
      setAboutInputValue(e.target.value)
    }
    const aboutEditModalOpenHandler = ()=> {
        setEditAboutModalOpen(true) ;
        setAboutInputValue(aboutText) ;
    }
    const addAboutHandler = ()=>{
        if (aboutInputValue) {
            set(ref(db, "profileAbout/" + logedinData.uid),{
                about:aboutInputValue,
            }).then(()=>{
                setAboutInputValue("") ;
                setAddAboutOpen(false);
            })
        }
    }
    const editAboutHandler = ()=>{
        if (aboutInputValue) {
            
            update(ref(db, "profileAbout/" + logedinData.uid),{
                about:aboutInputValue,
            }).then(()=>{
                setAboutInputValue("") ;
                setEditAboutModalOpen(false);
            })
        }
    }
    const deleteAboutHandler = ()=>{
        
        remove(ref(db, "profileAbout/" + logedinData.uid)).then(()=>{
            setAboutText("")
        })
        
    }
    // about part end
    
    // experience part start
    const [experienceInputValue, setExperienceInputValue] = useState({
        jobTitle:"",
        subJobTitle:"",
        companyName:"",
        startingJobDate:"",
        endJobDate:"",
        jobDetalls:"",
    }) ;
    const [experienceInputImage, setExperienceInputImage] = useState(null) ;
    const [addExperienceModalOpen, setAddExperienceModalOpen] = useState(false);
    const [experienceEditModalOpen, setExperienceEditModalOpen] = useState(false);
    const [endJobActive, setEndJobActive] = useState(true);
    const [experienceArr, setExperienceArr] = useState([]);
    // console.log(experienceArr);
    
    const experienceChangeHandler = (e)=>{
        if (e.target.name == "jobImage") {
            setExperienceInputImage(e.target.files[0])
        }
        else if (e.target.name == "endJobDate") {
            if (e.target.checked) {
                setEndJobActive(false)
                setExperienceInputValue({
                    ...experienceInputValue,
                    [e.target.name] : "now"
                })
            }else{
                setEndJobActive(true)
                setExperienceInputValue({
                    ...experienceInputValue,
                    [e.target.name] : e.target.value
                })
            }
        }
        else {
            setExperienceInputValue({
                ...experienceInputValue,
                [e.target.name] : e.target.value
            })
        }
        console.log(experienceInputValue);

    }

    const addExperienceHandler = ()=> {
        const storageRef = imageRef(storage, experienceInputImage.name + Date.now());
        uploadBytes(storageRef, experienceInputImage).then((snapshot) => {
            getDownloadURL(imageRef(storage, snapshot.metadata.fullPath)).then((downloadURL) => {
                set(push(ref(db, "profileExperience")),{
                    ...experienceInputValue,
                    experienceImage : downloadURL,
                    imageName: snapshot.metadata.fullPath,
                    ownerId:logedinData.uid,
                }).then(()=>{
                    setAddExperienceModalOpen(false)
                    setExperienceInputValue({
                        jobTitle:"",
                        subJobTitle:"",
                        companyName:"",
                        startingJobDate:"",
                        endJobDate:"",
                        jobDetalls:"",
                    }) ;
                    setExperienceInputImage(null) ;
                })
            });
            // console.log('Uploaded a blob or file!');
        });
    }
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    const formatDateCal = (startingDate,endingDate) => {
        // const date = new Date(parseInt(endDate)-parseInt(Dob));
        // const startingDate = new Date(startingDate);
        // const startingDate = new Date(startingDate);
        const startDate = new Date(startingDate) ;
        const endDate = endingDate == "now" ? new Date() : new Date(endingDate) ;
        const startDay = startDate.getDate() ;
        const startYear = startDate.getFullYear() ;
        const startMonth = startDate.getMonth() ;
        const endDay = endDate.getDate() ;
        const endYear = endDate.getFullYear() ;
        const endMonth = endDate.getMonth() ;

        let year = 0 ;
        let month = 0 ;
        let day = 0 ;
        if (endDay < startDay && endMonth < startMonth) {
            
            year = ((endYear - startYear) - (1)) ;
            month = ((endMonth + 12) - startMonth) - (1) ;
            day = (endDay + 30) - (startDay) ;
            return `${year} years ${month} months ${day} days`;
        }
        else {
            if (endDay < startDay) {
    
                year = endYear - startYear;
                month = (endMonth - startMonth) -1 ;
                day = (endDay + 30) - startDay ;
                
                return `${year} years ${month} months ${day} days`;
            }
            else if (endMonth < startMonth) {
                year = (endYear - startYear) - 1 ;
                month = (endMonth + 12) - startMonth ;
                day = endDay - startDate ;

                
                return `${year} years ${month} months ${day} days` ;
            }

            else {
                year = endYear - startYear ;
                month = endMonth - startMonth ;
                day = endDay - startDay ;
                return `${year} years ${month} months ${day} days`;
    
            }
        }
        
        // const month = date.toLocaleString
        // const year = date.getFullYear();
        // return `${day} ${month} ${year}`;
        // return `${day}`;
    }
    const deleteExperienceHandler = (item)=>{
        remove(ref(db, "profileExperience/" + item.key)).then(()=>{

            deleteObject(imageRef(storage, item.imageName))
        })
    }
    const experienceEditModalOpenHandler = (item)=>{
        // remove(ref(db, "profileExperience/" + key))
        
        setExperienceInputValue({
            jobTitle:item.jobTitle,
            subJobTitle:item.subJobTitle,
            companyName:item.companyName,
            startingJobDate:item.startingJobDate,
            endJobDate:item.endJobDate,
            jobDetalls:item.jobDetalls,
            imageName:item.imageName,
            groupKey:item.key,
            experienceImage:item.experienceImage,
            ownerId:item.ownerId,
        }) ;
        if (item.endJobDate == "now") {
            setEndJobActive(false) ;
        }else{
            setEndJobActive(true) ;
        }
        setExperienceEditModalOpen(true)
        console.log(experienceInputValue);
    }
    const editExperienceHandler = ()=>{
        // remove(ref(db, "profileExperience/" + key))
        
        if (experienceInputImage) {
            const storageRef = imageRef(storage, experienceInputValue.imageName);
            uploadBytes(storageRef, experienceInputImage).then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    update(ref(db, "profileExperience/" + experienceInputValue.groupKey),{
                        ...experienceInputValue,
                        experienceImage : downloadURL,
                        ownerId:logedinData.uid,
                    }).then(()=>{
                        setExperienceInputImage(null) ;
                        setExperienceInputValue({
                            jobTitle:"",
                            subJobTitle:"",
                            companyName:"",
                            startingJobDate:"",
                            endJobDate:"",
                            jobDetalls:"",
                        }) ;
                        setExperienceEditModalOpen(false) ;
                    })
                })
            })
            
            
        }else{
            update(ref(db, "profileExperience/" + experienceInputValue.groupKey),{
                ...experienceInputValue,
            }).then(()=>{
                setExperienceInputImage(null) ;
                setExperienceInputValue({
                    jobTitle:"",
                    subJobTitle:"",
                    companyName:"",
                    startingJobDate:"",
                    endJobDate:"",
                    jobDetalls:"",
                }) ;
                setExperienceEditModalOpen(false) ;
            })
        }
    }
    // experience part end

    // education part start
    const [educationInputValue, setEducationInputValue] = useState({
        instituteName:"",
        educationInformation:"",
        startingStudyDate:"",
        endStudyDate:"",
        educationDetalls:"",
    }) ;
    const [educationInputImage, setEducationInputImage] = useState(null) ;
    const [addEducationModalOpen, setAddEducationModalOpen] = useState(false);
    const [educationEditModalOpen, setEducationEditModalOpen] = useState(false);
    // const [endJobActive, setEndJobActive] = useState(true);
    const [educationArr, setEducationArr] = useState([]);

    const educationChangeHandler = (e)=> {
        console.log(e.target.name);
        if (e.target.name == "educationImage") {
            setEducationInputImage(e.target.files[0])
            console.log(e.target.files[0]);
        }
        else{
            setEducationInputValue({
                ...educationInputValue,
                [e.target.name] : e.target.value,
            })
        }

    }

    const addEducationHandler = ()=>{
        const storageRef = imageRef(storage, educationInputImage.name + Date.now())
        uploadBytes(storageRef, educationInputImage).then((snapshot)=>{
            getDownloadURL(imageRef(storage,snapshot.metadata.fullPath)).then(downloadURL =>{


                set(push(ref(db,"educationDetalls")),{
                    ...educationInputValue,
                    imageName: snapshot.metadata.name,
                    image: downloadURL,
                    ownerId: logedinData.uid
                }).then(()=>{
                    setEducationInputImage(null),
                    setEducationInputValue({
                        instituteName:"",
                        educationInformation:"",
                        startingStudyDate:"",
                        endStudyDate:"",
                        educationDetalls:"",
                    })
                    setAddEducationModalOpen(false)
                })
            })
        })
    }
    const deleteEducationHandler = (item)=>{
        console.log(item);
        remove(ref(db,"educationDetalls/" + item.key)).then(()=>{
            deleteObject(imageRef(storage,item.imageName))
        })
    }
    const educationEditModalOpenHandler = (item)=>{
        
        setEducationInputValue({
            instituteName:item.instituteName,
            educationInformation:item.educationInformation,
            startingStudyDate:item.startingStudyDate,
            endStudyDate:item.endStudyDate,
            educationDetalls:item.educationDetalls,
            imageName: item.imageName,
            image: item.image,
            ownerId: logedinData.uid,
            groupKey:item.key
        })
        setEducationEditModalOpen(true)
    }
    const editEducationHandler = ()=>{
        if (educationInputImage) {
            
            const storageRef = imageRef(storage, educationInputValue.imageName);
            uploadBytes(storageRef, educationInputImage).then(() => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    update(ref(db, "educationDetalls/" + educationInputValue.groupKey),{
                        ...educationInputValue,
                        image : downloadURL,
                    }).then(()=>{
                        setEducationInputImage(null),
                        setEducationInputValue({
                            instituteName:"",
                            educationInformation:"",
                            startingStudyDate:"",
                            endStudyDate:"",
                            educationDetalls:"",
                        })
                        setEducationEditModalOpen(false)
                    })
                })
            })
        }else{
            update(ref(db, "educationDetalls/" + educationInputValue.groupKey),{
                ...educationInputValue,
            }).then(()=>{
                setEducationInputImage(null),
                setEducationInputValue({
                    instituteName:"",
                    educationInformation:"",
                    startingStudyDate:"",
                    endStudyDate:"",
                    educationDetalls:"",
                })
                setEducationEditModalOpen(false)
            })
            
        }
    }
    // education part end
    
    return (
        <>
        <section id="profileAbout">
            <div>
                <Modal
                    open={addAboutOpen || editAboutModalOpen || addExperienceModalOpen || experienceEditModalOpen || addEducationModalOpen || educationEditModalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {
                            (addAboutOpen || editAboutModalOpen) ?
                                <Heading tagName="h2" className="updateNameHeading" title={addAboutOpen?"add about" : "edit your about"}>
                                    <>
                                        <TextField name='addAbout' onChange={aboutChangeHandler} type="text" className="regInput" id="outlined-basic" label="Type About You" value={aboutInputValue} variant="outlined" />
                                        <Button onClick={addAboutOpen?addAboutHandler:editAboutHandler} className="regBtn" variant="contained">{addAboutOpen?"add" : "edit"}</Button>
                                    </>
                                </Heading>
                            : (addExperienceModalOpen || experienceEditModalOpen) ?
                                <Heading tagName="h2" className="updateNameHeading" title={addExperienceModalOpen?"add experience" : "edit your experience"}>
                                    <Flex className="profileCatagoryMainModalDiv">
                                        <label className="uploadProfileCatagoryImageLabel">
                                            <div className="uploadProfileCatagoryImageDiv">
                                                <Image className="uploadProfileCatagoryImage" imageUrl={logedinData.photoURL} />
                                            </div>
                                            <input name='jobImage'  onChange={experienceChangeHandler} className="uploadProfileCatagoryImageInput" type="file" accept='image/*' />
                                            <Paragraph className="uploadProfileCatagoryImagePra" title="upload your picture" />
                                        </label>


                                        <TextField name='jobTitle' onChange={experienceChangeHandler} type="text" className="regInput" id="outlined-basic" label="Job Title" value={experienceInputValue.jobTitle} variant="outlined" />

                                        <TextField name='subJobTitle' onChange={experienceChangeHandler} type="text" className="regInput" id="outlined-basic" label="Sub Job Title" value={experienceInputValue.subJobTitle} variant="outlined" />

                                        <TextField name='companyName' onChange={experienceChangeHandler} type="text" className="regInput" id="outlined-basic" label="Company Name" value={experienceInputValue.companyName} variant="outlined" />

                                        <TextField name='startingJobDate' onChange={experienceChangeHandler} type="date" className="regInput" id="outlined-basic" label="Job Starting Date" value={experienceInputValue.startingJobDate} variant="outlined" InputLabelProps={{shrink: true,}} />

                                        <FormControlLabel name='endJobDate' onChange={experienceChangeHandler} control={!endJobActive?<Checkbox checked />:<Checkbox />} label="Present" />
                                        {
                                            endJobActive ?
                                                <TextField name='endJobDate' onChange={experienceChangeHandler} type="date" className="regInput" id="outlined-basic" label="Job End Date" value={experienceInputValue.endJobDate} variant="outlined" InputLabelProps={{shrink: true,}} />
                                            :
                                                <TextField name='endJobDate' type="date" className="regInput" id="outlined-basic" label="Job End Date" variant="outlined" InputLabelProps={{shrink: true,}} disabled />
                                        }

                                        <TextField name='jobDetalls' onChange={experienceChangeHandler} type="text" className="regInput" id="outlined-basic" label="Type Job Detalls" value={experienceInputValue.jobDetalls} variant="outlined" />


                                        <Button onClick={addExperienceModalOpen ? addExperienceHandler : editExperienceHandler} className="regBtn" variant="contained">{addExperienceModalOpen?"add" : "edit"}</Button>
                                    </Flex>

                                </Heading>
                            :
                                <Heading tagName="h2" className="updateNameHeading" title={addEducationModalOpen?"add education" : "edit your education"}>
                                    <Flex className="profileCatagoryMainModalDiv">
                                        <label className="uploadProfileCatagoryImageLabel">
                                            <div className="uploadProfileCatagoryImageDiv">
                                                <Image className="uploadProfileCatagoryImage" imageUrl={logedinData.photoURL} />
                                            </div>
                                            <input name='educationImage'  onChange={educationChangeHandler} className="uploadProfileCatagoryImageInput" type="file" accept='image/*' />
                                            <Paragraph className="uploadProfileCatagoryImagePra" title="upload your picture" />
                                        </label>


                                        <TextField name='instituteName' onChange={educationChangeHandler} type="text" className="regInput" id="outlined-basic" label="Institute Name" value={educationInputValue.instituteName} variant="outlined" />

                                        <TextField name='educationInformation' onChange={educationChangeHandler} type="text" className="regInput" id="outlined-basic" label="Education Information" value={educationInputValue.educationInformation} variant="outlined" />

                                        <TextField name='startingStudyDate' onChange={educationChangeHandler} type="date" className="regInput" id="outlined-basic" label="Study Starting Date" value={educationInputValue.startingStudyDate} variant="outlined" InputLabelProps={{shrink: true,}} />


                                        <TextField name='endStudyDate' onChange={educationChangeHandler} type="date" className="regInput" id="outlined-basic" label="Study End Date" value={educationInputValue.endStudyDate} variant="outlined" InputLabelProps={{shrink: true,}} />


                                        <TextField name='educationDetalls' onChange={educationChangeHandler} type="text" className="regInput" id="outlined-basic" label="Type Education Detalls" value={educationInputValue.educationDetalls} variant="outlined" />


                                        <Button onClick={addEducationModalOpen ? addEducationHandler : editEducationHandler} className="regBtn" variant="contained">{addEducationModalOpen?"add" : "edit"}</Button>
                                    </Flex>

                                </Heading>

                        }
                    </Box>
                </Modal>
            </div>
            <Container>
                {
                    aboutText ?
                        <div className="profileCatagoryBox">
                            <Flex className="profileCatagoryHeadingFlex">
                                <Heading tagName="h3" className="profileCatagoryHeading" title="about">
                                    <Flex className="aboutIcons">
                                        <AiOutlineEdit className="editProfileName" onClick={aboutEditModalOpenHandler} title="Edit Your About" />
                                        <RiDeleteBin6Line onClick={deleteAboutHandler} className="deleteProfileCatagory" title="Delete Your About" />
                                    </Flex>
                                </Heading>
                            </Flex>
                            {
                                aboutText.length > 300 ?
                                    <>
                                        <Paragraph className="aboutTextPra" title={aboutTextShow ? aboutText : aboutText.slice(0,300)+"..."} />
                                        <Button onClick={()=> setAboutTextShow(!aboutTextShow)}>{aboutTextShow ? "show less" : "show mone"}</Button>
                                    </>
                                    
                                :
                                    <Paragraph title={aboutText} />
                            }
                        </div>
                    :
                        <Button onClick={() => setAddAboutOpen(!addAboutOpen)} className="profileCatagoryBtn">add about</Button>
                        
                    }
            </Container>
        </section>

        <section id="profileExperience">
            <Container>
                <div className="profileCatagoryBox">
                    <Flex className="profileCatagoryHeadingFlex">
                        <Heading tagName="h3" className="profileCatagoryHeading" title="experience">
                            <Button onClick={()=>setAddExperienceModalOpen(!addExperienceModalOpen)} className="profileCatagoryBtn">add experience</Button>
                        </Heading>
                    </Flex>
                    {
                        experienceArr.map((item, index)=>{
                            // console.log(item.startingJobDate);
                            return(
                                <Flex key={index} className="catagoriItemBox">
                                    <div className="catagoriItemLogoDiv">
                                        <Image className="catagoriItemLogo" imageUrl={item.experienceImage} />
                                    </div>
                                    <div className="catagoriItemContent ">
                                        <Flex className="profileCatagoryJobHeadingFlex">
                                            <Heading tagName="h5" className="jobTitle" title={item.jobTitle}>
                                                <Flex className="aboutIcons">
                                                    <AiOutlineEdit className="editProfileName" onClick={()=>experienceEditModalOpenHandler(item)} title="Edit Your About" />
                                                    <RiDeleteBin6Line onClick={()=>deleteExperienceHandler(item)} className="deleteProfileCatagory" title="Delete Your About" />
                                                </Flex>
                                            </Heading>
                                        </Flex>
                                        <Flex className="subTitleAndConpanyName">
                                            <Paragraph className="subJob" title={item.subJobTitle} />
                                            <Paragraph className="conpanyName" title={item.companyName} />
                                        </Flex>
                                        <Flex className="subTitleAndConpanyName">
                                            <Flex className="dateClass">
                                                <Paragraph className="conpanyName" title={formatDate(item.startingJobDate) + " - "} />
                                                <Paragraph className="conpanyName" title={" "+formatDate(item.endJobDate == "now" ? new Date() : item.endJobDate )} />
                                            </Flex>
                                            <Paragraph className="jobTime" title={formatDateCal(item.startingJobDate,item.endJobDate)} />
                                        </Flex>
                                        <Paragraph title={item.jobDetalls} />

                                    </div>
                                </Flex>
                            )

                        })
                    }
                </div>
            </Container>
        </section>
        <section>
            <Container>
                <div className="profileCatagoryBox">
                    <Flex className="profileCatagoryHeadingFlex">
                        <Heading tagName="h3" className="profileCatagoryHeading" title="education">
                            <Button onClick={()=>setAddEducationModalOpen(!addEducationModalOpen)} className="profileCatagoryBtn">add education</Button>
                        </Heading>
                    </Flex>
                    {
                        educationArr.map((item, index)=>{
                            // console.log(item.startingJobDate);
                            return(
                                <Flex key={index} className="catagoriItemBox">
                                    <div className="catagoriItemLogoDiv">
                                        <Image className="catagoriItemLogo" imageUrl={item.image} />
                                    </div>
                                    <div className="catagoriItemContent ">
                                        <Flex className="profileCatagoryJobHeadingFlex">
                                            <Heading tagName="h5" className="jobTitle" title={item.instituteName}>
                                                <Flex className="aboutIcons">
                                                    <AiOutlineEdit className="editProfileName" onClick={()=>educationEditModalOpenHandler(item)} title="Edit Your About" />
                                                    <RiDeleteBin6Line onClick={()=>deleteEducationHandler(item)} className="deleteProfileCatagory" title="Delete Your About" />
                                                </Flex>
                                            </Heading>
                                        </Flex>

                                        <Heading tagName="h4" className="educationInfo" title={item.educationInformation} />

                                        <Flex className="subTitleAndConpanyName">
                                            <Flex className="dateClass">
                                                <Paragraph className="conpanyName" title={formatDate(item.startingStudyDate) + " - "} />
                                                <Paragraph className="conpanyName" title={" "+formatDate(item.endStudyDate)} />
                                            </Flex>
                                        </Flex>
                                        <Paragraph title={item.educationDetalls} />

                                    </div>
                                </Flex>
                            )

                        })
                    }
                </div>
            </Container>
        </section>
    </>
  )
}

export default ProfileDettals