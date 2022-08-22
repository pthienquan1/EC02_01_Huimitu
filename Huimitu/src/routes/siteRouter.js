const express = require("express");
const router = express.Router();
const ensureAnthenticated = require("../config/auth");
const SiteController = require("../app/controllers/SiteController");
var passport = require("passport");

router.get("/help", SiteController.help);

router.get(
  "/login/federated/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login/failure",
  })
);
router.get("/login/failure", (req, res) => {
  res.send("Something went wrong..");
});
router.get("/logout", ensureAnthenticated.ensureAuthenticated, SiteController.logout);
//router.get("/", SiteController.loginRe);
router.get("/login", SiteController.login);
router.post("/login", SiteController.validateLogin);
router.get("/register", SiteController.register);
router.post("/register", SiteController.validateRegister);
router.get(
  "/",
  //ensureAnthenticated.ensureAuthenticated,
  SiteController.index
);
router.get("/api/check-email-exist/:email", SiteController.checkEmailExist);


module.exports = router;
