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
  User.findById('68c6b3f78358292e48067e0c')
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
    "mongodb+srv://shubhamtesting:o30QALQHLFG9SMM9@cluster0.fgu9rgz.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
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
