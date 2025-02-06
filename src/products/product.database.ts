import fs from "fs";
import path from "path";
import { Products, UnitProduct } from "./product.interface";

const filePath = path.join(__dirname, "products.json");

/*

 tig load products sa file 
*/
export const getProducts = (): Products => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}), "utf-8");
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data) as Products;
};

/*

 tig save products sa file 
*/
export const saveProducts = (products: Products): void => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
};

/*

Tig find sa product gamit ang ID

*/
export const findOne = (id: string): UnitProduct | undefined => {
  const products = getProducts();
  return products[id];
};

/*

Tig remove or delete sa prudct gamit ang ID

*/
export const remove = (id: string): void => {
  const products = getProducts();
  delete products[id];
  saveProducts(products);
};
