import { motion } from "framer-motion";
import { useState } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import { useUserStore } from "../stores/useUserStore";

const UsersList = () => {
    const { users, changeUserRole } = useAdminStore();
	const { user: currentUser } = useUserStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");

    const openModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedRole("");
    };

    const isManager = currentUser?.role === "manager";

    return (
        <motion.div
            className="bg-white text-[#444] shadow-lg overflow-hidden max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full px-5">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">UserName</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    {users?.map((user) => (
                        <tbody key={user._id} className="bg-white divide-y divide-gray-300">
                            <tr className="hover:bg-gray-100 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap" title={user._id}>
                                    <div className="text-sm max-w-[250px] truncate">{user._id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm max-w-[160px] truncate">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" title={user.email}>
                                    <div className="text-sm max-w-[220px] truncate">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div
                                        className={`text-sm font-bold max-w-[100px] truncate ${
                                            user.role === "admin"
                                                ? "text-emerald-400"
                                                : user.role === "manager"
                                                ? "text-blue-400"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {user.role}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <button
                                        className={`p-3 text-sm ${
                                            user._id === currentUser?._id || isManager
                                                ? "bg-gray-400 cursor-not-allowed text-gray-300"
                                                : "bg-emerald-600 hover:bg-emerald-400 text-white cursor-pointer"
                                        }`}
                                        onClick={() => user._id !== currentUser?._id && openModal(user)}
                                        disabled={user._id === currentUser?._id || isManager}
                                    >
                                        Change Role
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
                    <div className="bg-gray-900 rounded-lg p-6 w-96">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Change Role for {selectedUser?.name}
                        </h2>

                        <select
                            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
								type='submit'
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                                onClick={() => {
									changeUserRole(selectedUser._id, selectedRole)
                                    closeModal();
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default UsersList;
