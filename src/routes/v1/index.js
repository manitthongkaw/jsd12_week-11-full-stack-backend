import { Router } from "express";
import { router as usersRoutes } from "./users.routers.js";
import { router as productsRoutes } from "./products.routers.js";
import { router as notesRoutes } from "./notes.routers.js";

export const router = Router();

router.use("/users", usersRoutes);
router.use("/products", productsRoutes);
router.use("/notes", notesRoutes);