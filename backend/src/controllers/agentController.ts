import { Request, Response } from "express";
import { IUser } from "../types/index.js";
import { User } from "../models/User.js";
import argon2 from "argon2";

// Create agent (admin only)
export const createAgent = async (req: Request, res: Response) => {
  console.log("hiii");
  const { fullName, email, phone, password } = req.body;
  try {
    // Validation
    if (!fullName || !email || !phone || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create agent
    const agent = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    await agent.save();
    res.status(201).json({
      message: "Agent created successfully",
      user: {
        _id: agent._id,
        fullName: agent.fullName,
        email: agent.email,
        phone: agent.phone,
        role: agent.role,
      },
    });
  } catch (error) {
    console.error("Create agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await User.find({}).select("-password").populate("taskIds");
    res.json(agents);
  } catch (error) {
    console.error("Fetch all agents error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
