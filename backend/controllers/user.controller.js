import User from "../models/user.model.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.json({ users })
    } catch (error) {
        console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const changeUserRole =  async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        if(role !== "customer" && role !== "admin"){
            return res.status(404).json({ message: "User role not valid" })
        }

        if (req.user._id === req.params.id) {
            return res.status(400).json({ message: "Cannot change your own role" });
        }

        const user = await User.findById(req.params.id)

        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        user.role = role;
        await user.save();

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}