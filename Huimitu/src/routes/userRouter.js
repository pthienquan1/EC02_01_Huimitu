const express = require("express");
const router = express.Router();
const UserController = require("../app/controllers/UserController");
const ensureAnthenticated = require("../config/auth");

router.delete('/:id', UserController.delete);
router.get('/', ensureAnthenticated.ensureAuthenticated, UserController.index);
router.get("/orders", ensureAnthenticated.ensureAuthenticated, UserController.getOrders);
router.get("/profile", ensureAnthenticated.ensureAuthenticated, UserController.getProfile);
router.post("/profile", ensureAnthenticated.ensureAuthenticated, UserController.updateProfile);

module.exports = router;
