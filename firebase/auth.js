import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

export const signInWithGoogle = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // Handle the successful authentication here
      console.log(result.user);
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
};
export const logout = () => {
  const auth = getAuth();
  return signOut(auth);
};
