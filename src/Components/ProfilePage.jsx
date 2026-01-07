import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { email } = JSON.parse(storedUser);
      setUserEmail(email);
    }
  }, []);

  return (
    <div className="profile">
      <h2>Profile Page</h2>
      {userEmail ? (
        <p>Email: {userEmail}</p>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
