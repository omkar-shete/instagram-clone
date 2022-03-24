import { Box, Button, Input, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import ImageUpload from './Components/ImageUpload/ImageUpload';
import './Components/Post/Post';
import Post from './Components/Post/Post';
import db, { auth } from './firebase';

//
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//----------------------------COMP FN----------------------

function App() {

  const [posts, setPosts] = useState([]);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [logInModalOpen, setLogInModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


// FETCHING POSTS DATA 
  useEffect(() => {
    const unsubscribe =
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot( snap=>(
      setPosts( snap.docs.map( doc=>({...doc.data(), id:doc.id}) ) )
    ));
     //cleanup
    return () => unsubscribe();
  }, []); 

  // console.log(posts);


//dont logout after refresh
  useEffect(() => {
    const unsub =
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user loggedin, dont logout
        setUser(authUser);
        // console.log(user);        
      } else {
        //user logeedout, set null
        setUser(null);
      }
    })
    //cleanup
    return () => unsub();
  }, [user])
    



//auth creation when signup
  const signupHandler = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((err) => alert(err.message));
    //closemodal
    setSignUpModalOpen(false);
  }
// console.log(user);

// //login
  const loginHandler = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((err) => alert(err.message))
    //closemodal
    setLogInModalOpen(false);
    setEmail('');
    setPassword('');
  }  

//closing signup/login modal
  const closeModalHandler = () => {
    setSignUpModalOpen(false);
    setLogInModalOpen(false);
    setUsername('');
    setEmail('');
    setPassword('');
  }



//  -----------RET--------------- 
  return (
    <div className="App">

    
  {/* ------- APP HEADER  */}
    <div className="app__header">
        <img
          className='app__header__logo' 
          // src="http://assets.stickpng.com/images/5a4e432a2da5ad73df7efe7a.png"
          src='https://library.kissclipart.com/20181005/hyq/kissclipart-instagram-text-png-clipart-logo-font-cd9a8245ee794c63.png'
          alt="" />
      {/* </div> */}


      {/* --------------- LOGIN/SIGNUP        */}
        <div>
          {/* ------- btn login/signup depending on if user is present------- */}
          {!user?
          (
            <div className="app__login">
              <Button onClick={() => setLogInModalOpen(true)}>LOG IN</Button>
              <Button onClick={() => setSignUpModalOpen(true)}>SIGN UP</Button>
            </div>)
          :
          (<div className="app__head__user">
            <div className="app__head__userAvatar"> <h2>{user?.displayName[0]}</h2> </div>
            <Button onClick={() => auth.signOut()}>LOG OUT</Button>
          </div>)
          }



        {/* MODAL01--SIGNUP -------- */}
          <Modal
            open={signUpModalOpen}
            onClose={closeModalHandler}
          >
            <Box sx={modalStyle}>
              <center>  

                <Typography variant="h6" component="h2">
                  Create an account
                </Typography>

                <div>                
                  <form className='app__signupModal' onSubmit={signupHandler}>
                    <Input 
                      type="text" 
                      placeholder='username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value) }
                      />

                    <Input 
                      type="email" 
                      placeholder='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value) }
                      />

                    <Input 
                      type="password" 
                      placeholder='password' 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      />

                    <Button type='submit'>Sign Up</Button>

                  </form>
                </div>
              </center>
            </Box>
          </Modal> 



        {/* MODAL02--LOGIN -------- */}
          <Modal
            open={logInModalOpen}
            onClose={closeModalHandler}
          >
            <Box sx={modalStyle}>
              <center>  

                <Typography variant="h6" component="h2">
                  Login to an account
                </Typography>

                <div>                
                  <form className='app__signupModal' onSubmit={loginHandler}>
                    {/* <Input 
                      type="text" 
                      placeholder='username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value) }
                      /> */}

                    <Input 
                      type="email" 
                      placeholder='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value) }
                      />

                    <Input 
                      type="password" 
                      placeholder='password' 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      />

                    <Button type='submit'>Log In</Button>

                  </form>
                </div>
              </center>
            </Box>
          </Modal>  

        </div>
    </div> 
    {/* headerend ---------*/}




  {/* caption, file picker, btn if user is loggein----------*/}

    {user?.displayName ?
      <ImageUpload username={user.displayName}/>
    :
      <h3 style={{color:"gray"}}>Please log in to upload</h3>
    }
    
        


  {/* ---------- POSTS  */}
    <div className="posts">

      {posts.map( posts=>(
        <Post 
          key={posts.id}
          postId={posts.id}
          user={user}
          username={posts.username} 
          caption={posts.caption} 
          imageURL={posts.imageURL}/>
      ))}
    </div>


    
  </div>
  );
}

export default App;
