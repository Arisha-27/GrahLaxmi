// app/lib/userStore.js

let userName = "";
let userEmail = "";
let userPhoto = "";
let userUid = ""; // ✅ Add UID

export const setUserInfo = (user) => {
  userName = user?.displayName || "";
  userEmail = user?.email || "";
  userPhoto = user?.photoURL || "";
  userUid = user?.uid || ""; // ✅ Save UID from Firebase
};

export const getUserInfo = () => ({
  userName,
  userEmail,
  userPhoto,
  uid: userUid, // ✅ Include UID in exported object
});
