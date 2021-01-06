const express = require("express");
const { blockUser, deleteUser } = require("../controllers/admin");
const { checkUserExist } = require("../middlewares/database/databaseErrors");
const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");
const router = express.Router();
router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id", checkUserExist, blockUser);
router.delete("/delete/:id", checkUserExist, deleteUser);

module.exports = router;
