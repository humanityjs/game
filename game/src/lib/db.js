import firebase from 'firebase';

import config from './config';

let dbRef;
export default () => {
  if (!dbRef) dbRef = firebase.initializeApp(config.base.firebase);
  return dbRef.database().ref();
};
