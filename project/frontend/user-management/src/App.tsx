import React, { useEffect, useState } from "react";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  created: string;
}

const TableUser: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      const jsonUser = await response.json();
      setUserData(jsonUser.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user: UserData) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      setUserData(userData.filter((u) => u.id !== id));
      alert("User deleted successfully!");
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      setUserData(userData.map((u) => (u.id === editUser.id ? editUser : u)));
      setIsEditModalOpen(false);
      alert("User updated successfully!");
    }
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
          onClick={fetchUserData}
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded shadow"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
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
                {userData.map((user) => (
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
                        onClick={() => handleDelete(user.id)}
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
        )}
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
              onClick={() => setIsViewModalOpen(false)}
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
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
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
                    setEditUser({ ...editUser, email: e.target.value })
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
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
