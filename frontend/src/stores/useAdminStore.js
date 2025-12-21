import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";


export const useAdminStore = create((set) => ({
    users: [],
    loading: false,
    
    fetchAllUsers: async () => {
        set({ loading: true })

        try {
            const res = await axios.get("/users");

            set({ users: res.data.users, loading: false });
        } catch (error) {
            set({ error: "Failed to fecth users", loading: false });

            toast.error(error.response.data.error || "Failed to fetch users");
        }
    },

    changeUserRole: async (userId, newRole) => {
        set({ loading: true });

        try {
            const res = await axios.patch(`/users/${userId}`, {
                role: newRole,
            });

            set((state) => ({
                loading: false,
                users: state.users.map((user) =>
                    user._id === userId ? res.data : user
                ),
            }));

            toast.success("User role updated");

        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to update user role");
        }
    }

}))