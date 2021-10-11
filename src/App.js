import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import "./App.css";
import initiazeAuthentication from "./firebase/firebase.initialize";

initiazeAuthentication();
const googleProvider = new GoogleAuthProvider();

function App() {
  const auth = getAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegisted, setIsRegisterd] = useState(false);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider).then((res) => {
      const user = res.user;
      console.log(user);
    });
  };

  const handleRegister = (event) => {
    event.preventDefault();

    isRegisted
      ? processLogin(email, password)
      : registerNewUser(email, password);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChnage = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const toggleLogin = (event) => {
    setIsRegisterd(event.target.checked);
  };

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("Password reset mail sent");
    });
  };

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
      });
  };

  const registerNewUser = (email, password) => {
    if (password.length < 6) {
      setError("Password must be 6 characters long.");
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password must have 2 Capital Letters.");
      return;
    }
    if (!/(?=.*[!@#$&*])/.test(password)) {
      setError("Password must have 1 Special Character.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res.user;
        console.log(user);
        setError("");
        verifyEmail();
        setUserName();
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
      });
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent");
    });
  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log("Name: ", name);
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <div className="m-5">
      <form onSubmit={handleRegister}>
        <h2 className="text-primary">
          Please, {isRegisted ? "Login" : "Register"}
        </h2>
        {isRegisted || (
          <div className="row mb-3">
            <label htmlFor="name" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                onBlur={handleNameChange}
                type="text"
                className="form-control"
                id="name"
                placeholder="Your Name"
                required
              />
            </div>
          </div>
        )}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handleEmailChange}
              type="email"
              className="form-control"
              id="inputEmail3"
              placeholder="Your Email"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handlePasswordChnage}
              type="password"
              className="form-control"
              id="inputPassword3"
              placeholder="Your Password"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input
                onChange={toggleLogin}
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
              />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div>
          <p className="text-danger">{error}</p>
        </div>
        <button type="submit" className="btn btn-primary">
          {isRegisted ? "Login" : "Register"}
        </button>
        <br />
        <button
          onClick={handleResetPassword}
          type="button"
          className="btn btn-secondary btn-sm mt-2"
        >
          Reset Password
        </button>
      </form>
      {/* <form onSubmit={handleRegister}>
        <h3>Please, Register</h3>
        <label htmlhtmlFor="email">Email: </label>
        <input type="text" name="email"/>
        <br />
        <label htmlhtmlFor="password">Password</label>
        <input type="password" name="password"/>
        <br />
        <input type="submit" value="Register" />
      </form> */}
      <br />
      <br />
      <br />
      <h3>----------------------------</h3>
      <br />
      <br />
      <br />
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
    </div>
  );
}

export default App;
