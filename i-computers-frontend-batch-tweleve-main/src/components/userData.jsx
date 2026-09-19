import React, {
  useContext,
} from "react";

import UserContext from "../context/userContext";

export default function UserData({
  children,
}) {
  const {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
  } = useContext(UserContext);

  if (isLoading) {
    return null;
  }

  return children({
    user,
    isAuthenticated,
    isAdmin,
  });
}