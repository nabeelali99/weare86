import React from "react";
import { UsersList } from "./UsersList";
import { TopUsers } from "./TopUsers";

export const UserAnalytics = ({ users, topUsers }) => {
  return (
    <div>
      <h3 style={{ margin: "10px" }}>All Users</h3>
      <UsersList users={users} />
      <h3 style={{ margin: "10px" }}>Top Active Users</h3>
      <TopUsers topUsers={topUsers} />
    </div>
  );
};
