import { useState, useContext } from "react";
//import { addUser } from "../api/user"; change to authService
import { VoidFunctionType } from "../types/functionTypes";
import { signup } from "../services/authService";
import { UserContext } from "../UserContext";
import { SignupResponseType } from "../types/entityTypes";

// Regex for validating email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regex for validating password strength
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

/**
 * Custom hook to handle sign up form
 * @param handleQuestions   Function to handle questions
 * @returns              Object containing form fields and functions to handle form
 */
export const useSignUp = (handleQuestions: VoidFunctionType) => {
  const [usrn, setUsrn] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [aboutme, setAboutme] = useState<string>("");
  const [linkedInLink, setLinkedInLink] = useState<string>("");

  const [abtmeErr, setAbtmeErr] = useState<string>("");
  const [usrnErr, setUsrnErr] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");
  const [lnkdErr, setLnkdErr] = useState<string>("");

  const { setUser } = useContext(UserContext);

  const postSignUp = async () => {
    let isValid = true;

    if (!aboutme) {
      setAbtmeErr("About Me cannot be empty");
      isValid = false;
    }

    if (!linkedInLink) {
      setLnkdErr("LinkedIn cannot be empty");
      isValid = false;  
    }else if (!/^(https:\/\/www.linkedin.com\/in\/[a-zA-Z0-9-]{5,30})$/.test(linkedInLink)) {
      setLnkdErr("Invalid LinkedIn URL format");
      isValid = false;
    }

    // Username validation
    if (!usrn) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    } else if (usrn.length < 3 || usrn.length > 20) {
      setUsrnErr("Username must be between 3 and 20 characters");
      isValid = false;
    } 

    // Email validation
    if (!email) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailErr("Invalid email format");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordErr("Password cannot be empty");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordErr("Password must be at least 8 characters long");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordErr(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const user = {
      username: usrn,
      email: email,
      password: password,
      aboutme: aboutme,
      linkedInLink: linkedInLink,
    };

    try {
      const res: SignupResponseType = await signup(user);
      if (res && res.success && res.user && res.token) {
        setUser(res.user);
        localStorage.setItem("token", res.token);
        handleQuestions();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during signup";
      console.error(errorMessage);
      // Set error state to display the error message in your component
    }
  };

  return {
    usrn,
    setUsrn,
    email,
    setEmail,
    password,
    setPassword,
    usrnErr,
    emailErr,
    passwordErr,
    aboutme,
    setAboutme,
    linkedInLink,
    setLinkedInLink,
    abtmeErr,
    lnkdErr,
    postSignUp,
  };
};
