import React, { useEffect, useState } from 'react';
import './Post.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import Avatar from '@mui/material/Avatar';
import db from '../../firebase';
import firebase from 'firebase/compat/app';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';




// --------COMP----------------
export default function Post( {postId, user, username, caption, imageURL} ) {

  //arr of obj of comments colln -&- single cmnt inp by user
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  //fetching comments
  useEffect(() => {
    const unsub =
    db
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snap=>{
      setComments(snap.docs.map((doc) => doc.data()))
    })
  
    return () => {unsub();}
  }, [postId]);
  // console.log(comments);



  const commentSubmitHandler = (e) => {
    e.preventDefault();
    db
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .add({
      comment: comment,
      commenterName: user.displayName, //username is the one who posted..
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  }

//--------------RET-----------------
  return (
    <div className='post'>

    {/* POST HEADER ---------------- */}
      <div className="post__header">

      {/* AVATAR & UNERNAME  */}
        <div className="post__head__left">
          <Avatar
            className='post__avatar'
            src=''
            alt={username[0]}/>

          <h3>{username}</h3>
        </div>

      {/* DEL ICON    */}
        <div className="post__head__right">
          <IconButton>
            <DeleteIcon/>
          </IconButton>
        </div>
      </div>



    {/* IMG ----------------- */}
      <div>
        <img
          className="post__img" 
          src={imageURL} 
          alt="loading.." />
      </div>



    {/* LIKES ICONS ------------------------ */}
      <div className="post__icons">
        <div>
          <FavoriteBorderIcon className='post__icon'/>
          <ChatBubbleOutlineIcon className='post__icon'/>
          <SendIcon className='post__icon'/>
        </div>
        <div>
          <BookmarkBorderOutlinedIcon className='post__icon'/>
        </div>
      </div>



    {/* NAME & CAPTION  */}
      <h4 className="post__caption">
        <strong>{username}: </strong>
        {caption}
      </h4>



    {/* SHOW COMMENTS */}
      <div className='posts__comments'>
        {comments.map(com=>(
          <p>
            <strong>{com.commenterName}: </strong>
            {com.comment}
          </p>
        ))}
      </div>



    {/* INPUT COMMENTS  */}
      {user?.displayName ?
      (
        <form onSubmit={commentSubmitHandler} className="posts__commentsForm">
        <input 
          className='posts__commentsForm__inp'
          type="text"
          placeholder='add comments'
          value={comment}
          onChange={(e) => setComment(e.target.value)} 
          />
        <button type='submit' disabled={!comment}>post</button>
      </form>
      )
      :
      <p style={{marginLeft:"0.5rem"}}>log in to comment</p>}
      


    </div>
  )
}
