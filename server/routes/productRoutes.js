const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");
const productSchema = require("../validators/productValidator");
const admin = require("../middleware/adminMiddleware");


const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { createProduct ,getAllProducts, getProductById,updateProduct, deleteProduct} = require("../controllers/productController");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/productValidator");

router.post(
  "/",
  protect,
  admin,
 upload.array("images", 10),
  validate(createProductSchema),
  createProduct
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.patch(
  "/:id",
  protect,
  admin,
  upload.array("images", 10),
  validate(updateProductSchema),
  updateProduct
);
router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

module.exports = router;