const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const { getAllUsers,  deleteUser, changeUserRole } = require("../controllers/userController");

router.get(
  "/",
  protect,
  admin,
  getAllUsers
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteUser
);

router.patch(
  "/:id/role",
  protect,
  admin,
  changeUserRole
);

module.exports = router;