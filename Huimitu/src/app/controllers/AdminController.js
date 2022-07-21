
const mongoose = require('../../utils/mongoose');
const Product = require('../models/Product');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose')
const User = require('../models/User');
const {APIfeatures} = require("../../config/features");


class AdminController {

    //[GET] /admin
    index(req, res, next) {
        res.render('admin/admin',{
            layout:'adminMain',
            
        })
    };
    products(req, res, next) {
        Product.find({})
            .then(products => {
                products = products.map(product => product.toObject())
                res.render('admin/products',{
                    products,
                    layout:'adminMain',
                });
            })
            .catch(error =>{
                res.status(400).send({message: error.message});
            })
    };

    storeProducts(req, res, next){
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status,
            country: req.body.country,
            qty: req.body.qty,
            price: req.body.price,
            discount: req.body.discount,
            keywords: req.body.keywords,
            qty: req.body.qty,
            fileImage: req.file.path,
        });
        product.save()
            .then(() => res.redirect('/admin/products'))
            .catch(error => {
                res.status(400).send({message: error.message});
            })
        
        //upload
       
    }
    productsDetails(req, res, next) {
        res.render('admin/productdetails', {layout:'adminMain'});
    };
    addProducts(req, res, next) {
        res.render('admin/addProducts', {layout:'adminMain'});
    };

    async manageUser(req, res, next) {
        // User.find({})
        //     .then(users => {
        //         users = users.map(user => user.toObject())
        //         res.render('admin/users',{
        //             users,
        //             layout:'adminMain',
        //         });
        //     })
        //     .catch(error =>{
        //         res.status(400).send({message: error.message});
        //     })
        try{
            const features = new APIfeatures(User.find({}) , req.query)
            .paginating().sorting().searching().filtering();
            

            const result = await Promise.allSettled([
                features.query,
                User.countDocuments()
            ]);
            //console.log(features);
            const users = result[0].status === 'fulfilled' ? result[0].value : [];
            const count = result[1].status === 'fulfilled' ? result[1].value : 0;
            // console.log(users);
            //return res.status(200).json({products, count})
            return res.render('admin/users',{users: multipleMongooseToObject(users),count,layout:'adminMain' });
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    };

    manageUserBanned(req, res, next) {
        User.findDeleted({})
            .then(users => {
                users = users.map(user => user.toObject())
                res.render('admin/bannedUsers',{
                    users,
                    layout:'adminMain',
                });
            })
            .catch(error =>{
                res.status(400).send({message: error.message});
            })
    };

    userRestore(req, res, next) {
        User.restore({ _id: req.params.id})
        .then(() => res.redirect('back'))
        .catch(next);
    }
}

module.exports = new AdminController;