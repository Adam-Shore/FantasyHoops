import React, { useState } from "react";
import "./LoginForm.css"; // Import the CSS file for styling
import { UserProvider } from './UserContext';
import UserContext from './UserContext';
import { useContext } from "react";


const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Access the UserContext
  const { loginUser } = useContext(UserContext);

  // ... (existing code)

  const handleSubmit = (event) => {
    event.preventDefault();

    // Here you can perform the login logic to check for valid user in the database.
    // For this example, we'll assume the database is an array of user objects.
    fetch("/db.json") // Assuming this API returns an array of user objects from the backend
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // Find the user object that matches the entered username and password
        const matchingUser = data.Users.find(
          (user) => user.username === username && user.password === password
        );
        const id = (user) => user.userid

        if (matchingUser) {
          // const userData = { username: username, isLoggedIn: true };
          // sessionStorage.setItem('user', JSON.stringify(userData));

          // Use the loginUser function from the UserContext to set the user
          // loginUser(userData);
          const newUser = {
            "userid": id,
            "username": username,
            "password": password,
            "joined_leagues": [],
            "user_teams": []
          }
          fetch('/db.json/CurrentUser', {
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

          console.log("Login successful");
          setErrorMessage("");
          // ... (existing code)
        } else {
          setErrorMessage("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to login. Please try again later.");
      });
  };

  const handleRegistration = () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    // Create a new user object
    const newUser = {
      id: 7,
      username: username,
      password: password,
      leagueIds: [],
    };

    // Send a POST request to the backend to register the new user
    fetch("/db.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the response from the backend contains a success message
        setErrorMessage(data.message);
        // Reset the form fields after successful registration
        setUsername("");
        setPassword("");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setErrorMessage("Failed to register user. Please try again later.");
      });
  };



  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <button type="button" onClick={handleRegistration} className="register-button">
          Create An Account
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
