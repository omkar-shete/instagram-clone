import { Button } from '@mui/material';
import React, { useState } from 'react';
import db, { storage } from '../../firebase';
import firebase from 'firebase/compat/app';
import './ImageUpload.css'


// -------------EXP FN----------

export default function ImageUpload({username}) {

  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [imageURL, setImageURL] = useState('');


  const imgHandler = (e) => {
    //1st selected file
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }  
  // console.log(image);


  
  const uploadHandler = () => {
    //upload to storage
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    //main job
    uploadTask.on(
      "state_changed",

      //1.calc prgrs
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) *100
        );
        setUploadProgress(progress);
      } ,

      //2.err
      (err) => console.log(err.message) ,

      //3.storage to db & add other things to db
      () => {
        storage
        .ref('images')
        .child(image.name)
        .getDownloadURL()
        .then((imgurl) => {
          // setImageURL(imgurl);
          db.collection('posts').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            caption: caption,
            imageURL: imgurl,
            username: username,
          })
          //reset inp
          setUploadProgress(0);
          setCaption('');
          setImage(null);
        })
        .catch((err) => alert(err.message))
      }

    )
  }
  // console.log(imageURL);
  // console.log(storage.ref('images').child(image.name).getDownloadURL());



  // -------------RET------------------------------------
  return (
    <div className='imageUpload'>

      <h4>Add new post</h4>

    
    {/* progress bar  */}
      <progress className='imageUpload__progressbar' value={uploadProgress} max='100'/>


    {/* file piker  */}
      <input 
        className='imageUpload__fileInput'
        type="file"
        // value={image} //doesntwork
        onChange={imgHandler}
        />


    {/* caption  */}
      <input 
        className='imageUpload__captionInput'
        type="text" 
        placeholder='enter caption' 
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        />
    

    {/* btn  */}
    <Button 
        onClick={uploadHandler} 
        disabled={!image}
        >
      Upload</Button>
  

    </div>
  )
}
