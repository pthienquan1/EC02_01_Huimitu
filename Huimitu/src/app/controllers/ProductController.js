const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../utils/mongoose");
const { APIfeatures } = require("../../config/features");

class ProductsController {
  edit(req, res, next) {
    Product.findById(req.params.id)
      .then((product) =>
        res.render("admin/editProducts", {
          product: mongooseToObject(product),
          layout: "adminMain",
        })
      )
      .catch(next);
  };

  // [PUT] /products/:id
  update(req, res, next) {
    Product.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/admin/products"))
      .catch(next);
  };

  // [DELETE] /products/:id
  delete(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  };

  // products(req, res, next) {
  //     Product.find({})
  //         .then(products => {
  //             products = products.map(product => product.toObject())
  //             res.render('products/products',{products,layout:'main'});
  //         })
  //         .catch(error =>{})
  // };

  details(req, res, next) {
    Product.findOne({ slug: req.params.slug })
      .then((product) => {
        res.render("products/details", {
          product: mongooseToObject(product),
        });
      })
      .catch(next);
  };

  async getProducts(req, res, next) {
    try {
      var successMsg = req.flash('success')[0];
      const features = new APIfeatures(Product.find({}), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        Product.countDocuments(),
      ]);
      //console.log(features);
      const products = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;
      // console.log(products);
      //return res.status(200).json({products, count})
      return res.render("products/products", {
        products: multipleMongooseToObject(products),
        count,
        layout: "main",
        successMsg: successMsg,
        noMessage: !successMsg
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  //Cart
  addToCart(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product){
      if (err){
        return res.redirect('/');
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      //console.log(req.session.cart);
      res.redirect('back');
    });
  };

  carts(req, res, next) {
    if(!req.session.cart){
      return res.render("products/carts", {products: null});
    }
    //console.log(req.session.cart);
    var cart = new Cart(req.session.cart);
    res.render("products/carts", {products: cart.generateArray(), totalPrice: cart.totalPrice});  
  };
  
  cartsReduceItem(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('back');
  };

  cartsRemoveItem(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('back');
  };

  checkOut(req, res, next) {
    if(!req.session.cart){ // or you can check total quantity instead
      return res.redirect('/products/carts');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0]; 
    res.render('products/checkout', {products: cart.generateArray(), total: cart.totalPrice, errMsg: errMsg, noError: !errMsg})
  };

  checkOutCharge(req, res, next) {
    if(!req.session.cart){
      return res.redirect('/products/carts');
    }
    var cart = new Cart(req.session.cart);

    const stripe = require('stripe')('sk_test_51LFYa0Hwma8KeAih1w1UvfMpwaj3rFdcOwn5judbp5tlwVCSI0jvpQSIdtlsjPvCHk7RefbvJGYLZL5cQbud4M6q00GODDGZkg');

    stripe.charges.create({
      amount: cart.totalPrice,
      currency: 'vnd',
      source: req.body.stripeToken, // getting from hidden element named 'stripeToken' in checkout page
      description: 'My First Test Charge (created for API docs)',
    }, function (err, charge) {        
      if (err) {
        req.flash('error', err.raw.message);
        return res.redirect('/products/checkout');
      }
      var order = new Order({
        user: req.user,   // passport stored this
        cart: cart,
        address: req.body.address,   // express stores values sent with POST req
        name: req.body.fullName,
        paymentId: charge.id
      });
      order.save(function(err, result) {
        // TODO: handle err
        //req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/products/confirmed');
        //res.redirect('/products');
      });      
    });
  };

  orderConfirmed(req, res, next) {
    res.render('products/orderComplete');
  }

}

module.exports = new ProductsController();
