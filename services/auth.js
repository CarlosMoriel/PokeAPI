import { app, auth } from '../bd/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const AuthUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
        console.log(user);
        return {status: true, message:'usuario logueado'}
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {status: false, message: errorMessage}
    });
}

export const RegisterUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
        return {status: true, message:'usuario registrado'}
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {status: false, message: errorMessage}
      });
}