const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
 const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('68d014a894d2ae294c897f5b')
    .then(user => {
      req.user =user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://shubhamnosql:BO9neq1N5bYGBOPH@cluster0.fgu9rgz.mongodb.net/mongooesshop?retryWrites=true&w=majority&appName=Cluster0")
  .then(result => {
    User.findOne().then(user => {
          if (!user) {
            const user = new User({
              name: 'shubham',
              email: 'shubham@gmail.com',
              cart: {
                items: []
              }
            });
            user.save();
          }
    app.listen(3000);
  })})
  .catch(err => {
    console.log(err);
  });
