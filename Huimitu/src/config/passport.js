const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../app/models/User');

module.exports = function(passport){
    passport.use(
        new localStrategy({ usernameField: 'email'},(email,password, done) => { console.log(email);
            User.findOne({ email: email})
            .then(user => {
                console.log(user);
                if(!user) {
                    return done(null,false,{ message: 'That email is not registered'})
                }

                bcrypt.compare(password,user.password, (err,isMatch)=> {
                    if(err) throw err;

                    if(isMatch){
                        return done(null,user);
                    } else {
                        return done(null, false, {message: 'Password incorrect'} )
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
    
    passport.serializeUser((user,done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        });
    });
}

