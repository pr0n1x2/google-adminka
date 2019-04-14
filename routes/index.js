const express = require('express');
const router = express.Router();
const pagesController = require('controllers/pages');
const authController = require('controllers/auth');
const placesController = require('controllers/places');

router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', pagesController.dashboardView);

router.get('/login', authController.loginView);
router.post('/login', authController.loginAction);

router.get('/register', authController.registerView);
router.post('/register', authController.registerAction);

router.get('/places', placesController.placesView);

router.get('/profile', pagesController.profileView);
router.post('/profile', pagesController.profileAction);

router.get('/password', function(req, res, next) {
  res.render('password', { title: 'Change password' });
});

router.get('/users', authController.onlyAdmin, pagesController.userView);

router.get('/logout', authController.logout);

module.exports = router;
