import User from "../models/User.js";

// Update username
export const updateUsername = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username cannot be empty" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name: username },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get user details
export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
