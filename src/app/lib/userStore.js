export const setUserInfo = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userName", user?.displayName || "");
    localStorage.setItem("userEmail", user?.email || "");
    localStorage.setItem("userPhoto", user?.photoURL || "");
    localStorage.setItem("userUid", user?.uid || "");
  }
};

export const getUserInfo = () => {
  if (typeof window !== "undefined") {
    return {
      userName: localStorage.getItem("userName") || "",
      userEmail: localStorage.getItem("userEmail") || "",
      userPhoto: localStorage.getItem("userPhoto") || "",
      uid: localStorage.getItem("userUid") || "",
    };
  }
  return {
    userName: "",
    userEmail: "",
    userPhoto: "",
    uid: "",
  };
};
