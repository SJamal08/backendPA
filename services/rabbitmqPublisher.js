// créé un fichier dans /services/rabbitmqpublisher.js

'use strict';

//lien rabbitMQ de connexion
let rabbitmq_connector = 'amqps://psabnghc:ars_RYFGXNKpPXFZkhBdRvwCEfW7M47x@crow.rmq.cloudamqp.com/psabnghc';

//ouverture de la connexion rabbitMQ avec la librairie 'amqplib'
//pour l'installer sur votre projet avec npm : npm install amqplib --save
let Open = require('amqplib').connect(rabbitmq_connector);



exports.import_publish = function(msg) {

  //définition de la queue import
  let q = 'import';

  Open.then(function(conn) {

    return conn.createChannel();//ouverture du channel sur lequel nous allons diffuser.

  }).then(function(ch) {

    //définition d'une queue durable, c'est à dire qu'elle restera après traitement.
    return ch.assertQueue(q, {durable: true}).then(function() {
      
      //envoie du message à la queue, attention celà prend uniquement des strings, du fait que je fais JSON.stringify(msg) car msg dans mon exemple est un JSON.
      ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));

      //fermeture du channel après envoie des informations, important car sinon les channels restent ouvert et celà fait planter les rabbitMQ à force :).
      return ch.close();

    });

  }).catch(console.warn);

};