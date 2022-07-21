const express = require("express");
const User = require("../models/User");
var Order = require("../models/Order");
var Cart = require("../models/Cart");
const bcrypt = require("bcryptjs");

class UserController {
  //[GET] /admin
  index(req, res, next) {
    res.redirect("user/profile");
  }

  getProfile(req, res, next) {    
    var _user = req.user;
    var successMsg = req.flash('success_msg')[0];
    var errorMsg = req.flash('error_msg')[0];
    res.render("users/user", {
      email: _user.email,
      username: _user.username,
      city: _user.city,
      country: _user.country,
      telephone: _user.telephone,
      success_msg: successMsg,
      error_msg: errorMsg,
    });
  };

  getOrders(req, res, next) {
    Order.find({user: req.user}).lean()
    .exec(function(err, orders) {
      if(err) {
        return res.write('Error!');
      }
      var cart;
      orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render('users/orders', { orders: orders })
    });
    // Order.find({user: req.user}, function(err, orders) {
    //   if(err) {
    //     return res.write('Error!');
    //   }
    //   var cart;
    //   orders.forEach(function(order) {
    //     cart = new Cart(order.cart);
    //     order.items = cart.generateArray();
    //   });
    //   res.render('users/orders', { orders: orders })
    // });
  };

    delete(req, res, next) {
        User.delete({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

  updateProfile(req, res, next) {
    User.findById(req.user.id, function (err, user) {
      //todo: handle err

      if (!user) {
        req.flash("error_msg", "No user found");
        return res.redirect("/user/profile");
      }

      var email = req.body.email.trim();
      var username = req.body.username.trim();
      var city = req.body.city.trim();
      var country = req.body.country.trim();
      var telephone = req.body.telephone.trim();

      //validate
      if (!email || !username || !city || !country || !telephone) {
        req.flash("error_msg", "One or more fields are empty");
        return res.redirect("/user/profile");
      }

      user.email = email;
      //user.username = username;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.city = city;
      user.country = country;
      user.telephone = telephone;

      //console.log(user);
      if (req.body.password) {
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save(function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                req.flash("success_msg", "Changed successfully!");
                res.redirect("/user/profile");
              }
            });
          })
        );
      } else {
        user.save(function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            req.flash("success_msg", "Changed successfully!");
            res.redirect("/user/profile");
          }
        });
      }
    });
  }
}

module.exports = new UserController();
