import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, setSelectedUser, setEditUser } from "../store/userSlice";
import { UserData } from "../types/user";
import { RootState, AppDispatch } from "../store/store";

const TableUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, selectedUser, editUser, isViewModalOpen, isEditModalOpen } =
    useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleView = (user: UserData) => {
    dispatch(setSelectedUser(user));
    dispatch(setEditUser(null));
  };

  const handleEdit = (user: UserData) => {
    dispatch(setSelectedUser(null));
    dispatch(setEditUser(user));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-2">User Data API</h1>
      <p className="text-gray-500 mb-8">Manage user data</p>

      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded shadow">
          👥 Users
        </button>
        <button
          onClick={() => dispatch(fetchUsers())}
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded shadow"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Created</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{user.id}</td>
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 border">{user.created}</td>
                  <td className="p-3 border flex items-center gap-2">
                    <button onClick={() => handleView(user)}>👁️</button>
                    <button onClick={() => handleEdit(user)}>✏️</button>
                    <button
                      onClick={() => dispatch(setEditUser(null))}
                      className="text-red-500"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Created:</strong> {selectedUser.created}
            </p>
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(setEditUser(null));
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    dispatch(setEditUser({ ...editUser, name: e.target.value }))
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    dispatch(
                      setEditUser({ ...editUser, email: e.target.value })
                    )
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <input
                  type="text"
                  value={editUser.role}
                  onChange={(e) =>
                    dispatch(setEditUser({ ...editUser, role: e.target.value }))
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(setEditUser(null))}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableUser;
