const Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { authenticate } = require("passport/lib");
const { isUserExit } = require("../../config/siteService");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../utils/mongoose");
const { APIfeatures } = require("../../config/features")
class SiteController {
  //[GET]
  async index(req, res, next) {

    const features = new APIfeatures(Product.find({}), req.query)
    .paginating()
    .sorting()
    .searching()
    .filtering();

    const result = await Promise.allSettled([
      features.query,
      Product.countDocuments(),
    ]);
    //const products = await Product.find();
    const products = result[0].status === "fulfilled" ? result[0].value : [];
    //console.log(req.user);
    // Product.find({})
    //         .then(products => {
    //             products = products.map(product => product.toObject())
    //             res.render('home',{
    //                 products,
    //                 layout:'main',
    //             });
    //         })
    //         .catch(error =>{
    //             res.status(400).send({message: error.message});
    //         })
    try {
      //const name = req.user;
      //const products = await Product.find();
      const users = User.find({ username: req.user.username });
      const features = new APIfeatures(Product.find({}), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const result = await Promise.allSettled([
          features.query,
          Product.countDocuments(),
        ]);

      const products = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;
      //console.log(req.user.username);
      return res.render("home", {
        products: multipleMongooseToObject(products),
        users,
        count,
        layout: "main",
      });
    } catch (err) {
      return res.render("home",{
        products: multipleMongooseToObject(products),
        layout: "main",
      });
    }
    // if(req.user == undefined){
    //     res.render("home");
    // }
    // else{
    // res.render("home", {
    //   name: req.user
    // });
  }

  loginRe(req, res, next) {
    res.redirect("/login");
  }

  login(req, res, next) {
    res.render("login");
  }  

  logout(req, res, next) {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  }

  validateLogin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
      session: true,
    })(req, res, next);
  }

  register(req, res, next) {
    res.render("register");
  }

  async checkEmailExist(req, res, next) {
    const User = await isUserExit(req.params.email);
    res.json(!!User);
  }

  validateRegister(req, res, next) {
    const { email, password, username, fullAdress, city, country, telephone } =
      req.body;
    let errors = [];

    //check required fields
    if (
      !email ||
      !password ||
      !username ||
      !fullAdress ||
      !city ||
      !country ||
      !telephone
    ) {
      errors.push({ msg: "Please fill in all fields" });
    }

    //check password length
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" });
    }

    if (errors.length > 0) {
      res.render("register", {
        errors,
        email,
        password,
        username,
        fullAdress,
        city,
        country,
        telephone,
      });
    } else {
      User.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            email,
            password,
            username,
            fullAdress,
            city,
            country,
            telephone,
          });
        } else {
          const newUser = new User({
            email,
            password,
            username,
            fullAdress,
            city,
            country,
            telephone,
          });

          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/login");
                })
                .catch((err) => console.log(err));
            })
          );
        }
      });
    }
  }
}

module.exports = new SiteController();
