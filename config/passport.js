const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// const User = require("../model/authEntry");

const mongoURI = require("./mongoURI");
const mongoDB = mongoURI.URI;
const conn = mongoose.createConnection(mongoDB);
const coll = conn.collection('register');

const key = require("./key");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        coll.findOne({ payload_id: jwt_payload.id }).then(user => {
            if (user) {
                return done(null, user);
            };
            return done(null, false);
        }).catch(err => console.log(err)); // for debugging purposes
    })
  );
};