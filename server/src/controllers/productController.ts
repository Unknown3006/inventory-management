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

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, price, rating, stockQuantity } = req.body;

    // Validate productId
    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Update only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (rating !== undefined) updateData.rating = rating ? parseFloat(rating) : undefined;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);

    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: updateData,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Delete the product
    await prisma.products.delete({
      where: { productId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
