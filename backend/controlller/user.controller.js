import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY || "yourSecretKey";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { userId, password, name, role } = req.body;

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userId,
      password: hashedPassword,
      name,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { userId: newUser.userId, name: newUser.name, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Secret key for JWT

export const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log(userId, password);
    // Find user by userId
    const user = await User.findOne({ userId: userId });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expiration time
    );
    console.log(token)
    // Respond with success and token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { userId: user.userId, name: user.name, role: user.role },
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "userId name role");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//verufyToken

export const verifyToken = (res, req, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(4010)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "default_secret"
    );
    req.user = decoded;
    return res.status(200).json({ success: true, decoded });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Invalid token" });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId, name, role, password } = req.body;

    // Find the user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if provided in the request body
    if (name) user.name = name;
    if (role) user.role = role;

    // If the password is being updated, hash the new password
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user in the database
    await user.save();

    // Return a success response with the updated user data
    return res.status(200).json({
      message: "User updated successfully",
      user: { userId: user.userId, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user without verifyToken

// Controller to delete a user by userId
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL parameters

    // Find and delete the user by their userId
    const user = await User.findOneAndDelete({ userId });

    // If no user is found, send a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is deleted successfully, send a 200 response
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
