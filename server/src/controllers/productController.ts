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
        userId: (req as any).user?.userId, // Filter by User ID
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
    // DEBUG: Log raw body to identify API Gateway issues
    console.log("=== POST /products DEBUG ===");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body type:", typeof req.body);
    console.log("Body:", JSON.stringify(req.body));

    // FIX: API Gateway may double-stringify the body
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
        console.log("Parsed stringified body:", body);
      } catch (e) {
        console.error("Failed to parse body string:", e);
        res.status(400).json({ message: "Invalid JSON in request body" });
        return;
      }
    }

    const { name, price, rating, stockQuantity } = body;

    console.log("Destructured values:", { name, price, rating, stockQuantity });

    // Validate required fields
    if (!name || price === undefined || price === null || stockQuantity === undefined || stockQuantity === null) {
      console.error("Validation failed:", { name, price, stockQuantity });
      res.status(400).json({ message: "Missing required fields: name, price, stockQuantity" });
      return;
    }

    // Generate productId (format: PROD + timestamp + random number)
    const productId = `PROD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Safely coerce types (handles both string and number inputs)
    const parsedPrice = typeof price === "number" ? price : parseFloat(price);
    const parsedRating = rating != null ? (typeof rating === "number" ? rating : parseFloat(rating)) : undefined;
    const parsedStock = typeof stockQuantity === "number" ? stockQuantity : parseInt(stockQuantity);

    console.log("Parsed values:", { productId, name, parsedPrice, parsedRating, parsedStock });

    // Validate parsed values are not NaN
    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      console.error("NaN detected after parsing:", { parsedPrice, parsedStock });
      res.status(400).json({ message: "Invalid numeric values for price or stockQuantity" });
      return;
    }

    const product = await prisma.products.create({
      data: {
        productId,
        userId: (req as any).user?.userId, // Set User ID
        name,
        price: parsedPrice,
        rating: parsedRating,
        stockQuantity: parsedStock,
      },
    });
    console.log("Product created successfully:", product.productId);
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error?.message || error);
    console.error("Stack trace:", error?.stack);
    res.status(500).json({ message: "Error creating product", error: error?.message });
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

    // Delete dependent records first to satisfy foreign key constraints
    await prisma.sales.deleteMany({
      where: { productId },
    });

    await prisma.purchases.deleteMany({
      where: { productId },
    });

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
