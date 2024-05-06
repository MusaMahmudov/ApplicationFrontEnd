import React, { createContext, useEffect, useState } from "react";
import { UserInformation, UserInformationStore } from "../models/UserModels";

type userContextProps = {
  children: React.ReactNode;
};

const initialValue: UserInformation = {
  id: "",
  userName: "",
  email: "",
  Roles: [],
};

const initialValueOfStore = {
  user: initialValue,
  setUser: () => {},
};

const UserContext = createContext<UserInformationStore>(initialValueOfStore);

const UserContextProvider = (props: userContextProps) => {
  const [user, setUser] = useState<UserInformation>(initialValue);

  return (
    <UserContext.Provider value={{ user, setUser }}></UserContext.Provider>
  );
};
export { UserContext, UserContextProvider };
