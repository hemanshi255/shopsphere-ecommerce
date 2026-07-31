import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import defaultProfile from "../assets/img/defaultProfile.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import "../css/profile.css";
import { Helmet } from "react-helmet-async";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await api.get("/auth/profile");

      setUser(response.data.user);
      setName(response.data.user.name);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.put("/auth/profile", formData);
      console.log(response.data.user);

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("storage"));

      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>My Profile | ShopSphere</title>

        <meta
          name="description"
          content="Manage your ShopSphere profile information, update account details, and maintain your personal account settings securely."
        />

        <meta
          name="keywords"
          content="ShopSphere profile, user account, account settings, update profile, ecommerce account"
        />

        <meta property="og:title" content="My Profile | ShopSphere" />

        <meta
          property="og:description"
          content="Manage your ShopSphere profile information, update account details, and maintain your personal account settings securely."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow profile-card">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">My Profile</h2>

                {user && (
                  <>
                    <div className="text-center mb-4">
                      <div className="profile-image-wrapper">
                        <img
                          src={
                            user.profileImage
                              ? `http://localhost:5000/uploads/${user.profileImage}`
                              : defaultProfile
                          }
                          alt="Profile"
                          className="profile-image"
                        />

                        <label
                          htmlFor="profileImage"
                          className="edit-profile-btn"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </label>

                        <input
                          id="profileImage"
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => setProfileImage(e.target.files[0])}
                    />

                    <h5 className="mt-3">
                      Email:
                      <span className="ms-2">{user.email}</span>
                    </h5>

                    <h5 className="mt-3">
                      Role:
                      <span className="ms-2 text-capitalize">{user.role}</span>
                    </h5>

                    <button
                      className="btn add-product-btn w-100 mt-4"
                      onClick={handleUpdate}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
