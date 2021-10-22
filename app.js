const express = require('express');

const app = express();
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const cors = require('cors');
const compileRoute = require('./routes/code');

app.use(cors());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@pacluster.gzl5d.mongodb.net/PaDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/code', compileRoute);


module.exports = app;