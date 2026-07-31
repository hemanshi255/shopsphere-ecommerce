import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/users/${id}`);

      toast.success(response.data.message);

      getUsers();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, {
        role,
      });

      toast.success("User role updated successfully");

      getUsers();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Manage Users | ShopSphere Admin</title>

        <meta
          name="description"
          content="Manage registered users from the ShopSphere Admin Dashboard. View user accounts and maintain customer information securely."
        />

        <meta
          name="keywords"
          content="ShopSphere admin, manage users, customer management, ecommerce users, admin dashboard"
        />

        <meta property="og:title" content="Manage Users | ShopSphere Admin" />

        <meta
          property="og:description"
          content="Manage registered users from the ShopSphere Admin Dashboard. View user accounts and maintain customer information securely."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-4">
        <h2 className="fw-bold mb-4">Users Management</h2>

        <div className="card shadow">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-thead-bg">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>

                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={
                            user.role === "admin"
                              ? "badge bg-danger"
                              : "badge bg-success"
                          }
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex flex-column flex-md-row gap-2">
                          {user.role === "user" ? (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => changeRole(user._id, "admin")}
                              >
                                Make Admin
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteUser(user._id)}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => changeRole(user._id, "user")}
                            >
                              Make User
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
