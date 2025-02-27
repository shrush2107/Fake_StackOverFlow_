import { createContext, Dispatch, SetStateAction } from "react";
import { UserResponseType } from "./types/entityTypes";

interface UserContextType {
  user: UserResponseType | null;
  setUser: Dispatch<SetStateAction<UserResponseType | null>>;
}

/**
 * UserContext is a context that stores the user information.
 * It is used to store the user information after the user logs in.
 */
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {
    throw new Error("setUser function must be overridden");
  },
});
