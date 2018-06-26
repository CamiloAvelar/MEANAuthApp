/**TODO:
+Automate the deploy to heroku
+Fix the TODOS in googleoauth
**/

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect to database
mongoose.connect(config.database);

//On connect
mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${config.database}`);
})

//On error
mongoose.connection.on('error', (err) => {
    console.log(`Database error ${err}`);
})

const app = express();

const users = require('./routes/users');

//Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    seveUnitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint')
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})