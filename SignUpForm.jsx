import React, { useState, useEffect, useRef } from "react";
import "./SignUpForm.css"; // Import the CSS file for styling
import { UserProvider } from './UserContext';
import UserContext from './UserContext';
import { useContext } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';
import LoginForm from "./LoginForm.jsx";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';


const SignUpForm = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  const fetchNumberOfUsers = async () => {
    try {
      const response = await fetch('/db.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const data = await response.json();
      const users = data.Users; // Assuming 'Users' is the key for the array of users in the JSON data
      const numberOfUsers = users.length;
      console.log('Number of users:', numberOfUsers);
      // You can set the constant here or use it for other logic as needed
      return numberOfUsers;
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error as needed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    const numberOfUsers = await fetchNumberOfUsers();
    const newUser = {
      "userid": numberOfUsers + 1,
      "username": user,
      "password": pwd,
      "joined_leagues": [],
      "user_teams": []
    }

    try {
      fetch('/db.json/Users', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      })
        .then(response => response.json())
        .then(data => {
          console.log('', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });

      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus();
    }
  }


  return (
    <>
      {success ? (
        <section className="success-bonanza">
          <h1 className="success-heading-bonanza">Success!</h1>
          <p className="success-paragraph-bonanza">
            <a href="#" className="success-link-bonanza">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="signup-section-bonanza">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" className="error-message-bonanza">{errMsg}</p>
          <form onSubmit={handleSubmit} className="signup-form-bonanza">
            <label htmlFor="username" className="form-label-bonanza">
              Username:
              <FontAwesomeIcon icon={faCheck} className={validName ? "valid-icon-bonanza" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validName || !user ? "invalid-icon-bonanza" : "hide"} />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className={`form-input-bonanza ${userFocus && user && !validName ? "input-instructions-bonanza" : ""}`}
            />
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"} className="input-info-bonanza">
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.<br />
              Must begin with a letter.<br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password" className="form-label-bonanza">
              Password:
              <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid-icon-bonanza" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "invalid-icon-bonanza" : "hide"} />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className={`form-input-bonanza ${pwdFocus && !validPwd ? "input-instructions-bonanza" : ""}`}
            />
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"} className="input-info-bonanza">
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.<br />
              Must include uppercase and lowercase letters, a number and a special character.<br />
              Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd" className="form-label-bonanza">
              Confirm Password:
              <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid-icon-bonanza" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "invalid-icon-bonanza" : "hide"} />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className={`form-input-bonanza ${matchFocus && !validMatch ? "input-instructions-bonanza" : ""}`}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"} className="input-info-bonanza">
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button disabled={!validName || !validPwd || !validMatch ? true : false} className="signup-button-bonanza">
              Sign Up
            </button>
          </form>
          <p className="login-text-bonanza">
            Already registered?<br />
            <span className="line">
              <Link to="/login" className="login-link-bonanza">Login</Link>
            </span>
          </p>
        </section>
      )}
    </>
  )

}

export default SignUpForm;
