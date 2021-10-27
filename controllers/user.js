const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const exercises = require('../data/Exercise.json')
let ServiceRabbit = require("../services/rabbitmqPublisher");

exports.signup = (req, res, next) => {
    ServiceRabbit.import_publish("un user veut s'inscrire");
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                exercises: exercises
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    ServiceRabbit.import_publish("un user veut se logger");
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id,
                            username: user.username,
                            exercises: user.exercises
                        },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getUserFromToken = (req, res, next) => {
    ServiceRabbit.import_publish("recup de données user");
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    User.findOne({ _id: userId })
        .then(user => {
            res.status(200).json(user);
        }
        )
        .catch(error => res.status(404).json({ error }));
}

exports.updateUser = (user, token) => {
    ServiceRabbit.import_publish("update user");
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    User.updateOne({ _id: userId }, { ...user, _id: userId })
        .then(() => console.log("updated"))
        .catch(() => console.log("update failed"))
}