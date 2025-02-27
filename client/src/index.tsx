import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./index.css";
import FakeStackOverflow from "./components/fakestackoverflow";
import { UserContext } from "./UserContext";
import { UserResponseType } from "./types/entityTypes";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const [user, setUser] = useState<UserResponseType | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <FakeStackOverflow />
    </UserContext.Provider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
