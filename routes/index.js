const express = require('express');
const firebase = require('firebase');
const nodemailer = require('nodemailer');
const Email = require('../models/email');
const Group = require('../models/group');
const Newsletter = require('../models/newsletter');
const Offer = require('../models/offer');
const Product = require('../models/product');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const auth = require('./middleware/auth');

const router = express.Router();

/**
 * GET Home page
 */
 router.get('/', (req, res) => {
     res.render('menu', { title: 'Menu', layout: 'layoutDashboard' });
 });

 /**
  * GET Forms page
  */
  router.get('/forms', (req, res) => {
      res.render('forms', { title: 'Menu', layout: 'layoutDashboard' });
  });

  router.get('/agroweb/form', (req, res) => {
      res.render('agroweb/new', { title: 'Agroweb', layout: 'layoutDashboard' });
  });

 /**
  * GET Logins page
  */
  router.get('/logins', (req, res) => {
      res.render('logins', { title: 'Menu', layout: 'layoutDashboard' });
  });

  router.get('/agroweb/login', (req, res) => {
      res.render('agroweb/login', { title: 'Agroweb', layout: 'layoutDashboard' });
  });
module.exports = router;
