import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const EditUser = () => {
  const { userInfo } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:4000/profile/${userInfo.id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((response) => {
      response.json().then((user) => {
        setAge(user.user.age);
        setEmail(user.user.email);
        setName(user.user.name);
        setPhone(user.user.phone);
        setBio(user.user.bio);
      });
    });
  }, []);

  async function updateUser(e) {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:4000/profile/${userInfo.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          age,
          bio,
        }),
      }
    );
    if (response.ok) {
      navigate("/profile");
      toast.success("Profile updated");
    } else {
      toast.error("Profile update failed");
    }
  }

  return (
    <form action="" className="register" onSubmit={updateUser}>
      <h1>Update User</h1>
      <input
        type="text"
        name="name"
        id="name"
        maxLength="20"
        minLength="3"
        required
        autoFocus
        title="Name may only contain letters with a length between 3 and 20"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        name="email"
        id="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        name="phone"
        id="phone"
        minLength="10"
        maxLength="10"
        pattern="[0-9]{10}"
        required
        title="Phone may only contain numbers without country code"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="number"
        name="age"
        id="age"
        required
        placeholder="Age"
        title="Age may only contain numbers between 18 and 100"
        min="18"
        max="100"
        step="1"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <textarea
        type="text"
        name="bio"
        id="bio"
        maxLength="200"
        minLength="0"
        autoFocus
        title="Bio may only contain letters with a length between 0 and 200"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button type="submit">Update User</button>
    </form>
  );
};
