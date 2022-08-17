const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path') ;
const methodOverride = require('method-override')
const app = express();
const port = process.env.PORT || 5000;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const express_handlebars_sections = require('express-handlebars-sections');


const route = require('./routes');
const db = require('./config/db/index.js');
const req = require('express/lib/request');

//passport config
require('./config/passport')(passport);


//upload images


// connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended:true
})) 
app.use(express.json());
app.use(methodOverride('_method'))

app.engine('hbs', engine({
    defaultLayout: 'main',
    helpers: {
        section: express_handlebars_sections(),
        splitPath: function(fileImage){
            const fsub = fileImage.substring(11);
            const fchange = fsub.replace(" \\ "," \ ");
            //console.log(fsub);
            return fchange;
        },
        splitPath2: function(fileImage){
            const fsub = fileImage.substring(11);
            const fchange = fsub.replace(" \\ "," / ");
            //console.log(fsub);
            return fchange;
        },
        cur: function(price){
            let dollarUS = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "VND",
            });
            const cur = dollarUS.format(price);
            return cur;
        }
    },
    extname: '.hbs',
}));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Express session
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
}));
//connect flash
app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use((req, res, next)=>{
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    if(req.isAuthenticated()) {
        res.locals.user = req.user.toJSON();
    }    
    // res.locals.success_msg = req.flash('success_msg');
    // res.locals.error_msg = req.flash('error_msg');
    // res.locals.error = req.flash('error');
    next();
})

// route init
route(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

