import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Input } from '@material-ui/core';
import './App.css';
import Post from "./Components/Post";
import { db, auth } from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import ImageUpload from "./Components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

const useStyles = makeStyles((theme) => ({
  paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);


  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
  }, [user])

  useEffect(() => {
    onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), snapshot => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password).then(userCred => {
        updateProfile(auth.currentUser, {
          displayName: userName
        }).catch((err) => {
          alert(err.message)
        })
        setEmail("");
        setPassword("");
        setUserName("");
        setOpen(false);
    })
    .catch((err) => alert(err.message))
  }

  const handleSignOut = () => {
    signOut(auth)
  }

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password).then(() => {
      setEmail("")
      setPassword("")
      setOpenSignIn(false);
    })
    .catch(err => {
      alert(err.message);
    })
  }

  const body = (
    <div className="modalSignup">
      <form>
        <center>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
            alt=""
            className="modalSignup__logo"
          />

          <Input 
            placeholder="User name"
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />

          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button type="submit" onClick={signUp}> Sign up </Button>
        </center>
      </form>
    </div>
  );

  const signInModal = (
    <div className="modalSignup">
      <form>
        <center>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
            alt=""
            className="modalSignup__logo"
          />
          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button type="submit" onClick={signIn}> Sign In </Button>
        </center>
      </form>
    </div>
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={handleClose}
        className="app__signupModal"
      >
        {body}
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        className="app__signupModal"
      >
        {signInModal}
      </Modal>


      <div className="app__header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
          alt="instagram"
          className="app__headerImage"
        />
        {
          user ? <Button onClick={handleSignOut}> Sign out </Button> : (
              <div className="app__loginContainer">
                <Button onClick={handleOpen}> Sign up </Button>  
                <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
              </div>
            )
        }
      </div>
        
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post 
                key={id}
                imageUrl={post?.imageUrl} 
                caption={post?.caption}
                userName={post?.userName}
                user={user}
                postId={id} 
              />
            ))
          }

          {
            !posts.length && (
                <h2 className="app__emptyPosts"> No current posts </h2>
            )
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed 
            url="https://instagram.am/p/B_uf9dmAGPw"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocal=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      

      {
        user?.displayName ? <ImageUpload userName={user.displayName}/> : <h3 className="app__loginToPost"> Login to post </h3>
      }

    </div>
  );
}

export default App;