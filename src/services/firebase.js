import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { enableIndexedDbPersistence } from "firebase/firestore"; 
import { getDatabase, ref, onValue } from "firebase/database";
//import { notification } from "antd";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

//connection 
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
const providerGithub = new firebase.auth.GithubAuthProvider();
//signing with platformeAccount
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signInWithGithub = () => auth.signInWithPopup(providerGithub);
export const signInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const database = getFirestore(app);

//enable persistance 
const getDb = getDatabase(app);
const connectedRef = ref(getDb, ".info/connected");
export const getConnectStatus = () => {
  onValue(connectedRef, (snap) => {
    if (snap.val() === false) {
     return false;
    } else{
      return true;
    }
  });
}
onValue(connectedRef, (snap) => {
  if (snap.val() === false) {
    enableIndexedDbPersistence(database).catch(err => {
      console.log(err.code);
      //handleError(err.code);
      return database;
    });
  } 
});


//getError
/*const handleError = error => {
  if (error === "failed-precondition") {
    notification.open({
      message: "Error",
      description:
        "Multiple tabs open, offline data only works in one tab at a a time."
    });
  } else if (error === "unimplemented") {
    notification.open({
      message: "Error",
      description: "Cannot save offline on this browser."
    });
  }
};*/

export const getUsers = () => {
  const userRef = collection(database, "users");
  return new Promise((resolve, reject) => {
    onSnapshot(userRef, (result) => {
      const data =
        result.docs.reduce((acc, doc) => {
          return [...acc, { ...doc.data() }];
        }, []) || [];
      resolve(data);
    });
  });
};


export async function sendMessage(roomId, user, text) {
  try {
      await addDoc(collection(database, 'chat-rooms', roomId, 'messages'), {
          uid: user.uid,
          displayName: user.displayName,
          text: text.trim(),
          timestamp: serverTimestamp(),
      });
  } catch (error) {
      console.error(error);
  }
}

export function getMessages(roomId, callback) {
  return onSnapshot(
      query(
          collection(database, 'chat-rooms', roomId, 'messages'),
          orderBy('timestamp', 'asc')
      ),
      (querySnapshot) => {
          const messages = querySnapshot.docs.map((x) => ({
              id: x.id,
              ...x.data(),
          }));

          callback(messages);
      }
  );
}
