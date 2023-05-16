import React, { createContext, useState, useEffect } from 'react';
import firebase from '../firebase';
import Swal from "sweetalert2";
import { User } from "../types/user";

export interface UserContextData {
  user: User;
  checkForUser: boolean;
  setUser: (user: User) => void;
  signInUser: () => void;
  logoutUser: () => void;
}

export const UserContext = createContext<Partial<UserContextData>>({});

const UserProvider: React.FC = ({children}) => {
  const [ user, setUser ] = useState<User>({dbRef: "public/", loggedIn: false});
  const [ checkForUser, setCheckForUser ] = useState<boolean>(true); 

  // ------- check if there's a logged in user before retrieving any tasks
  useEffect(function checkForAuthenticatedUser() {
    // check if there is a current user
    firebase.auth().onAuthStateChanged((user) => {
      // if there is a user update state with the dbRef and loggedIn to true
      if (user) {
        setUser({dbRef: user.uid + "/", loggedIn: true});
      }
      // set checkForUser to false
      setCheckForUser(false)
    })
  }, [])

  

  // --------------------------- signInUser (Google Auth)
  const signInUser = () => {
    // create new google auth provider
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // initiate sign in with popup using google auth
    firebase.auth().signInWithPopup(provider)
      .then(({user}) => {
        // once user is signed in, set user info and user's dbRef in state
        if (user) {
          setUser({
            dbRef: user.uid + "/",
            loggedIn: true
          })
        }

        setCheckForUser(true);
      })
      .catch(error => {
        // if there is an error, display an alert

        Swal.fire({
          title: "Oops!",
          text: "There was an error signing in: " + error,
          icon: "error",
          confirmButtonText: "OK"
        })
      })
  }

  // --------------------------- logoutUser
  const logoutUser = () => {
    firebase.auth().signOut()
      .then(() => {
        // once user is logged out, reset user and dbRef in state
        setUser({
          dbRef: "public/",
          loggedIn: false
        })

        setCheckForUser(true);
      })
      .catch(error => {
        // if there is an error, display an alert
        Swal.fire({
          title: "Oops!",
          text: "There was an error while logging out: " + error,
          icon: "error",
          confirmButtonText: "OK"
        })
      })
  }

  const value = {
    user,
    checkForUser,
    setUser,
    signInUser,
    logoutUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;