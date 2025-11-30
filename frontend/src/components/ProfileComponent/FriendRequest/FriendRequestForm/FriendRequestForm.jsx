import React, { useState } from "react";
import "./FriendRequestForm.css";
import api from "../../../../utils/api";

export default function FriendRequestForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    const res = await api.post('/friends/friend-requests/send', { receiverEmail: email },{
      withCredentials: true
    });
    //console.log(res.data);
    if (res.data.status === "success") {
      //console.log("Friend request sent");
    }
    setEmail("");
  };

  return (
    <div className="friends-card">
      <header>
        <h2>Gửi lời mời kết bạn</h2>
        <p>Nhập email của người bạn muốn kết nối.</p>
      </header>
      <form className="friends-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email bạn bè"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="friends-input"
          required
        />
        <button type="submit" className="friends-btn primary">
          Gửi lời mời
        </button>
      </form>
    </div>
  );
}
