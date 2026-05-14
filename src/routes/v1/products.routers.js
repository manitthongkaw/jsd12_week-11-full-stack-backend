import { Router } from "express";
import { products } from "../../fakeData/fakeProducts.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const { name, price, desc } = req.body || {};
  if (!name || price === undefined) return res.status(400).json({ error: "Name and price are required" });
  const nextId = String( (products.reduce((max, p) => Math.max(max, Number(p.id)), 0) || 0) + 1 );
  const newProduct = { id:nextId, name, price:Number(price), desc };
  products.push(newProduct);
  return res.status(201).json(newProduct);
});

router.put("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  const { name, price, desc } = req.body;
  if (!name || price === undefined || !desc) return res.status(400).json({ error: "Name, price and desc are required" });
  product.name = name;
  product.price = Number(price);
  product.desc = desc;
  return res.status(200).json(product);
});

router.delete("/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(index, 1);
  return res.status(200).json(products);
});