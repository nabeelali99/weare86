import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { UserAnalytics } from "../Components/UserAnalytics";
import { PostAnalytics } from "../Components/PostAnalytics";

export const AnalyticsPage = () => {
  const [analyticsType, setAnalyticsType] = useState("User");

  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/users").then((response) => {
      response.json().then((users) => {
        setUsers(users);
        console.log(users);
      });
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/topUsers").then((response) => {
      response.json().then((topUsers) => {
        setTopUsers(topUsers);
        console.log(topUsers);
      });
    });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{analyticsType} Analytics</h1>
      <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
        <Button
          style={{ backgroundColor: "black" }}
          variant="contained"
          onClick={() => setAnalyticsType("User")}
        >
          User Analytics
        </Button>
        <Button
          style={{ backgroundColor: "black" }}
          variant="contained"
          onClick={() => setAnalyticsType("Post")}
        >
          Post Analytics
        </Button>
      </div>
      <div>
        {analyticsType === "User" ? (
          <UserAnalytics users={users} topUsers={topUsers} />
        ) : (
          <PostAnalytics />
        )}
      </div>
    </div>
  );
};
