// firebase.js
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import { Task, NewTask, TaskStatus, TaskDeleteList } from "./types/task";

// *** USE YOUR CONFIG OBJECT ***
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCf4r4_JiAWZjMYxHx2oPdOOPBunUeG9zg",
  authDomain: "taskboard-drethedev.firebaseapp.com",
  databaseURL: "https://taskboard-drethedev.firebaseio.com",
  projectId: "taskboard-drethedev",
  storageBucket: "taskboard-drethedev.appspot.com",
  messagingSenderId: "868447749524",
  appId: "1:868447749524:web:bc280f2ee21da6c3fe7b81",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// --------------------------- addTask
export const addTask = (dbRef: string, newTask: NewTask) => {
  firebase.database().ref(dbRef).push(newTask);
};

// --------------------------- updateTask
export const updateTask = (dbRef: string, key: string, newValue: string) =>
  firebase
    .database()
    .ref(dbRef + key)
    .update({ task: newValue });

// --------------------------- removeTask
export const removeTask = (dbRef: string, key: string) =>
  firebase.database().ref(dbRef).child(key).remove();

// --------------------------- moveTask
export const moveTask = (dbRef: string, status: TaskStatus) => {
  firebase.database().ref(dbRef).update({ status });
};

// --------------------------- clearTaskList
export const clearTaskList = (dbRef: string, taskListItems: TaskDeleteList) => {
  // pass an object of keys with null values to clear multiple items
  firebase.database().ref(dbRef).update(taskListItems);
};

// --------------------------- clearTaskboard
export const clearTaskboard = (dbRef: string) => {
  // remove all items in firebase
  firebase.database().ref(dbRef).remove();
};

export const retrieveTaskItems = (dbRef: string, setTaskItems: (taskItems: Task[]) => void) => {
  // listener for any value change on the db reference
  firebase
    .database()
    .ref(dbRef)
    .on("value", (response) => {
      const tasksData = response.val();

      // create empty array to store data retrieved from db later
      const taskItems: Task[] = [];
      for (const key in tasksData) {
        const taskItem: Task = {
          key: key,
          task: tasksData[key].task,
          status: tasksData[key].status,
        };
        taskItems.push(taskItem);
      }

      // update state with the taskItems retrieved from the database
      setTaskItems(taskItems);
    });
};

// this exports the CONFIGURED version of firebase
export default firebase;
