const productsRouter = require("./productsRouter");
const siteRouter = require("./siteRouter");
const adminRouter = require("./admin/adminRouter");
const userRouter = require("./userRouter");
const authRouter = require("./authRouter");

function route(app) {
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);
  app.use("/products", productsRouter);
  app.use("/", siteRouter);
}

module.exports = route;
