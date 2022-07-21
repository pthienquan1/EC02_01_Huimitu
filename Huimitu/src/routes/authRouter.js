const User = require("../app/models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID =
  "346214843991-okpqecfp5dun44mqe1e8d406ju59jgm1.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://shoppe-fake.herokuapp.com/oauth2/redirect/google",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      //check user table for anyone with a Google ID of profile.id
      User.findOne(
        {
          email: profile.email,
        },
        function (err, user) {
          if (err) {
            return done(err);
          }
          //No user was found... so create a new user with values from Google (all the profile. stuff)
          let tempPassword = "123456";
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(tempPassword, salt, (err, hash) => {
              if (err) throw err;
              tempPassword = hash;
            })
          );
          if (!user) {
            user = new User({
              email: profile.email,
              password: tempPassword,
              username: profile.email.split("@")[0],
              fullAdress: "",
              city: "",
              country: "",
              telephone: "",
            });
            user.save(function (err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            //found user. Return
            return done(err, user);
          }
        }
      );
    }
  )
);
