import "./index.css";
import { useState, ChangeEvent, KeyboardEvent, useContext } from "react";
import { VoidFunctionType, QuestionsPageQueryFuntionType } from "../../types/functionTypes";
import { UserContext } from "../../UserContext";

interface HeaderProps {
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
  handleSignUp: VoidFunctionType;
  handleLogin: VoidFunctionType;
  handleProfile: VoidFunctionType;
}
/**
 *  Header component  that displays the title of the app, search bar, and buttons for sign up, login, and profile
 * @param param0    search: string, setQuestionPage: QuestionsPageQueryFuntionType, handleSignUp: VoidFunctionType, handleLogin: VoidFunctionType, handleProfile: VoidFunctionType
 * @returns      Header component
 */
const Header = ({ search, setQuestionPage, handleSignUp, handleLogin, handleProfile }: HeaderProps) => {
  const [val, setVal] = useState<string>(search);
  const { user, setUser } = useContext(UserContext);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.currentTarget.value, "Search Results");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div id="header" className="header">
      <div></div>
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {user ? (
        <>
          <div>Welcome, {user.username}</div>
          <button className="bluebtn" onClick={handleLogout}>
            Logout
          </button>
          <button className="bluebtn" onClick={handleProfile}>
            Profile
          </button>
        </>
      ) : (
        <>
          <button className="bluebtn" onClick={handleSignUp}>
            Sign Up
          </button>
          <button className="bluebtn" onClick={handleLogin}>
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
