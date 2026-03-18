import { Router } from "express";
import { getUsers, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.put("/update", updateUser);

export default router;
