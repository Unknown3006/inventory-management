import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import authRoutes from "./routes/authRoutes";
import { verifyToken } from "./middleware/authMiddleware";

// Force reload trigger
/* ROUTE CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.text({ type: "text/plain" }));

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://main.d1dde88exbhzg1.amplifyapp.com", // Your Amplify frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Handle Preflight success status for API Gateway
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://localhost:3000",
          "https://main.d1dde88exbhzg1.amplifyapp.com",
        ],
      },
    },
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

/* ROUTES */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});
app.use("/auth", authRoutes); // http://localhost:8000/auth
app.use("/dashboard", verifyToken, dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", verifyToken, productRoutes); // http://localhost:8000/products
app.use("/users", verifyToken, userRoutes); // http://localhost:8000/users
app.use("/expenses", verifyToken, expenseRoutes); // http://localhost:8000/expenses

/* SERVER */
const port = Number(process.env.PORT) || 3001;
console.log("Server starting...");
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
