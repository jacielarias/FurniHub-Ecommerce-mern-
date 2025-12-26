import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
    order: [],
    loading: false,

    fetchAllOrders: async () => {
        set({ loading: true })

        try {
            const res = await axios.get("/orders");
            
            set({ orders: res.data.order, loading: false });
            
        } catch (error) {
            set({ error: "Failed to fetch orders", loading: false });

            toast.error(error.response.data.error || "Feiled to fetch orders");
        }
    }
}));