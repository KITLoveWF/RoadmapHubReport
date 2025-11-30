import React, { useState, useEffect } from "react";
import "./ProfileComponent.css";
import axios from "axios";
import AlertError from "../../SignUp/AlertError";
import AlertSuccess from "../../SignUp/AlertSuccess";
import PopUpAvatar from "../PopUpAvatar/PopUpAvatar";
import api from "../../../utils/api";
const ProfileComponent = ({ changeIntoSetting }) => {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // thay đổi avatar
  const [avatarModal, setAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();
  const getUserData = async () => {
    // Backend tự động lấy user info từ token trong Authorization header
    const userData = await api.get("/profiles/get-profile");
    //console.log("User data:", userData.data);
    setEmail(userData.data.email);
    setFullname(userData.data.profile.fullname);
    setGithub(userData.data.profile.github);
    setLinkedin(userData.data.profile.linkedin);
    setAvatarUrl(userData.data.profile.avatar||"https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg");
    return userData.data.profile;
  };
  useEffect(() => {
    getUserData();
  }, []);
  //Hàm thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    ////console.log(name, value);
    switch (name) {
      case "fullname":
        setFullname(value);
        break;
      case "github":
        setGithub(value);
        break;
      case "linkedin":
        setLinkedin(value);
        break;
      default:
        break;
    }
  };
  //thay avatar
  const handleAvatarUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    //console.log(formData.get("avatar"));
    // Backend tự động lấy user info từ token
    const res = await api.post("/profiles/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const newUrl = res.data.avatarUrl;
    setAvatarUrl(newUrl);
    window.location.reload();
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    try {
      // Backend tự động lấy user info từ token
      const res = await api.post("/profiles/update-profile", {
        fullname,
        github,
        linkedin,
      });
      //console.log("Response data:", res.data);
      if (!res.data?.status) {
        setError("Cập nhật thông tin không thành công");
        setSuccess("");
      } else {
        setSuccess("Cập nhật thông tin thành công");
        setError("");
      }
    } catch {
      setError("Cập nhật thông tin không thành công");
      setSuccess("");
    }
  };
  return (
    <div className="content-wrapper">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar">
            <img src={avatarUrl} alt="Profile Avatar" />
          </div>
          <button
            className="edit-avatar-btn"
            type="button"
            aria-label="Edit avatar"
            onClick={() => setAvatarModal(true)}
          >
            <span className="sr-only">Edit avatar</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm15.71-9.04a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z" />
            </svg>
          </button>
        </div>
      </div>
      <form className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            id="name"
            name="fullname"
            value={fullname || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            value={email || ""}
            disabled
            className="disabled-input"
          />
          <a className="email-change-link" onClick={changeIntoSetting}>
            Visit settings page to change email
          </a>
        </div>

        <div className="form-group">
          <label htmlFor="github">GitHub</label>
          <input
            type="url"
            id="github"
            name="github"
            value={github || ""}
            onChange={handleInputChange}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={linkedin || ""}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        {error && <AlertError content={error} />}
        {success && <AlertSuccess content={success} />}
        <button type="button" className="save-btn" onClick={handleSaveProfile}>
          Save Profile
        </button>
      </form>
      <PopUpAvatar
        show={avatarModal}
        onClose={() => setAvatarModal(false)}
        onUpload={handleAvatarUpload}
        uploading={uploading}
      />
    </div>
  );
};

export default ProfileComponent;
