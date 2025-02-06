import express from "express";
import userRoutes from "./users/users.route"; 
import productRoutes from "./products/product.routes";

const app = express();
const PORT = process.env.PORT || 5000;

/* middleware para tig parse sa json file */
app.use(express.json());





app.use("/", userRoutes);
app.use("/", productRoutes);









app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
