import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const existingUser = await prisma.users.findFirst({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User already exists with this email" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        userId: uuidv4(), // Fix: using uuid package instead of crypto
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.userId });
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    res.status(500).json({ message: "Error registering user", details: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Missing email or password" });
      return;
    }

    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ message: "Login successful", token, user: { userId: user.userId, name: user.name, email: user.email } });
  } catch (error: any) {
    console.error("Login endpoint error:", error);
    res.status(500).json({ message: "Error logging in user", details: error.message });
  }
};
