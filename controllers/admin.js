const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(null, title, imageUrl, description, price);
  req.user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    })
    // Product.create({
    //   title: title,
    //   imageUrl: imageUrl,
    //   price: price,
    //   description: description,
    //   userId: req.user.id,
    // })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) return res.redirect("/");

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.save();
    })
    .then((result) => {
      console.log("Updated");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.deleteById(prodId);
  Product.findByPk(prodId)
    .then((product) => product.destroy())
    .then((result) => {
      console.log("product destroyed!!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
