const express = require('express');
const router = express.Router();
const ensureAnthenticated = require("../config/auth");
const productController = require('../app/controllers/ProductController');

router.get('/:id/edit', productController.edit);
router.get('/details/:slug', productController.details);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
//router.get('/', productController.products);
router.get('/',  productController.getProducts);
router.get('/add-to-cart/:id',ensureAnthenticated.ensureAuthenticated, productController.addToCart);
router.get('/carts',ensureAnthenticated.ensureAuthenticated, productController.carts);
router.get('/reduce/:id',ensureAnthenticated.ensureAuthenticated, productController.cartsReduceItem);
router.get('/remove/:id',ensureAnthenticated.ensureAuthenticated, productController.cartsRemoveItem);
router.get('/checkout',ensureAnthenticated.ensureAuthenticated, productController.checkOut);
router.post('/checkout',ensureAnthenticated.ensureAuthenticated, productController.checkOutCharge);
router.get('/confirmed',ensureAnthenticated.ensureAuthenticated, productController.orderConfirmed)

module.exports = router;