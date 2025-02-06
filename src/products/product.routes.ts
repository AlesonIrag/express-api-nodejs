import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getProducts, saveProducts, findOne, remove } from "./product.database";
import { Product, UnitProduct } from "./product.interface";

const router: Router = Router();

/*

Tig Get tanan products

*/
router.get("/products", (req: Request, res: Response): void => {
  const products = getProducts();
  if (!Object.keys(products).length) {
    res.status(404).json({ error: "No products found" });
    return;
  }
  res.status(200).json({ totalProducts: Object.keys(products).length, products });
});

/*

tIG GET Sa product nga single ID ra 

*/
router.get("/products/:id", (req: Request, res: Response): void => {
  const product = findOne(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.status(200).json(product);
});

/*

Tig add og another product

*/
router.post("/products", (req: Request, res: Response): void => {
  const { name, price, quantity, image } = req.body;

  if (!name || price === undefined || quantity === undefined || !image) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const newProduct: UnitProduct = {
    id: uuidv4(),
    name,
    price,
    quantity,
    image,
  };

  const products = getProducts();
  products[newProduct.id] = newProduct;
  saveProducts(products);

  res.status(201).json({ newProduct });
});

/*

Tig update a product using the PRODUCT Id

*/
router.put("/products/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  const { name, price, quantity, image } = req.body;

  if (!name || price === undefined || quantity === undefined || !image) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  let products = getProducts();
  if (!products[id]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  products[id] = { id, name, price, quantity, image };
  saveProducts(products);

  res.status(200).json({ updatedProduct: products[id] });
});

/*
 tIG DElete sa product Gamit ID 
*/
router.delete("/products/:id", (req: Request, res: Response): void => {
  const product = findOne(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  remove(req.params.id);
  res.status(200).json({ message: "Product deleted successfully" });
});

export default router;
