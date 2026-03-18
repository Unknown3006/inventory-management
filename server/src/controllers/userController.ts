import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = (req as any).user?.email;

    // Only Pushkar is allowed to view other users
    if (email !== "pushkar@gmail.com") {
      res.json([]);
      return;
    }

    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedUser = await prisma.users.update({
      where: { userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json({
      message: "User updated successfully",
      user: {
        userId: updatedUser.userId,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};
