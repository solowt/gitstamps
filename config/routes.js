var express = require('express');
var router = express.Router();
var passport = require('passport')
var usersController = require('../controllers/usersController');
var profilesController = require('../controllers/profilesController');

router.route('/login')
  .get(usersController.login)

router.route('/logout')
  .get(usersController.logout)

router.route('/profiles:format?')
  .get(profilesController.getProfiles)
  .post(profilesController.addProfile)

router.route('/')
  .get(function(req,res){
    res.redirect('/profiles')//only humans, never go to .json
  })

router.route('/profiles/check')
  .get(profilesController.checkProfile)

router.route('/profiles/unfollowed.json')
  .get(profilesController.getUnfollowedProfiles)

router.route('/profiles/:id')
  .get(profilesController.getProfile)
  .patch(profilesController.updateProfile)
  .delete(profilesController.deleteProfile)

router.route('/profiles/:id/unfollow')
  .delete(usersController.unfollowProfile)

router.route('/profiles/:id/stamps')
  .get(profilesController.getStamps)
  .post(profilesController.addStamp)

router.route('/auth/github')
  .get(passport.authenticate('github'))

router.route('/auth/github/callback')
  .get(passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

module.exports = router;
