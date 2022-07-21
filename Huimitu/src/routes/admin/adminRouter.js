const express = require('express');
const router = express.Router();
const Anthenticated = require('../../config/auth');
const adminController = require('../../app/controllers/AdminController')
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
});  
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/gif" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
});


router.get('/addProducts', adminController.addProducts);
router.post('/addProducts',upload.single('fileImage'), adminController.storeProducts);
router.get('/products', adminController.products);
router.get('/products/details', adminController.productsDetails);
router.get('/users/manage', adminController.manageUser);
router.get('/users/banned', adminController.manageUserBanned);
router.patch('/:id/restore', adminController.userRestore);
router.get('/', Anthenticated.isAdmin, adminController.index);


module.exports = router;