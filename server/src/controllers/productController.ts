import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, rating, stockQuantity } = req.body;

    // Validate required fields
    if (!name || price === undefined || stockQuantity === undefined) {
      res.status(400).json({ message: "Missing required fields: name, price, stockQuantity" });
      return;
    }

    // Generate productId (format: PROD + timestamp + random number)
    const productId = `PROD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : undefined,
        stockQuantity: parseInt(stockQuantity),
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};
