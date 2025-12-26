import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});

        res.json({ orders })
    } catch (error) {
        console.log("Error in getAllOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const changeOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        // updates order Status
        const updatedStatus = Order.findByIdAndUpdate(req.params.id, {
            status
        }, { new: true })

        // updates statusHistory
        if(updatedStatus){
            order.statusHistory.push({ status: updatedStatus });
        }

        res.json(updatedStatus)
    } catch (error) {
        res.status(500).json({ message: "Error when chaging order status", error: error.message })
    }
};