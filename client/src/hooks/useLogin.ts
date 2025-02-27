import { useState, useContext } from 'react';
import { VoidFunctionType } from '../types/functionTypes';
import { login } from '../services/authService';
import { UserContext } from '../UserContext';
import { LoginData, LoginResponseType } from '../types/entityTypes';

/**
 * Hook to handle login functionality
 * @param handleQuestions   Function to handle questions after successful login
 * @returns              Object containing emailOrUsername, setEmailOrUsername, password, setPassword, login, emailErr, passwordErr
 */
export const useLogin = (handleQuestions: VoidFunctionType) => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailErr, setEmailErr] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');

  const { setUser } = useContext(UserContext);

  const loginFunc = async () => {
    let isValid = true;

    // Reset error messages
    setEmailErr('');
    setPasswordErr('');

    // Validation
    if (!emailOrUsername) {
      setEmailErr('Email or Username cannot be empty');
      isValid = false;
    }

    if (!password) {
      setPasswordErr('Password cannot be empty');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const credentials: LoginData = {
      emailOrUsername,
      password,
    };

    try {
      const res: LoginResponseType = await login(credentials);
      if (res && res.success && res.user && res.token) {
        setUser(res.user);
        localStorage.setItem('token', res.token);
        handleQuestions();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred during login';
      console.error(errorMessage);
      setEmailErr(errorMessage); // Display error to the user
    }
  };

  return {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    login: loginFunc,
    emailErr,
    passwordErr,
  };
};
