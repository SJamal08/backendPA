// créé un fichier dans /workers/rabbitmq_consumers.js

'use strict';

//lien rabbitMQ de connexion
let rabbitmq_connector = 'amqps://psabnghc:ars_RYFGXNKpPXFZkhBdRvwCEfW7M47x@crow.rmq.cloudamqp.com/psabnghc';

//ouverture de la connexion rabbitMQ avec la librairie 'amqplib'
//pour l'installer sur votre projet avec npm : npm install amqplib --save
let Open = require('amqplib').connect(rabbitmq_connector);

let import_consume = function()
{
  let q = 'import';

  // Consumer
  Open.then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel()//connexion au channel ou creation de celui ci.

      .then(function(ch) {
        let ok = ch.assertQueue(q, {durable: true});// connexion à la queue durable
        ok = ok.then(function () {
          ch.prefetch(2);//  nombre de traitement simultanée lancé
        });
        ok = ok.then(function () {
          ch.consume(q, doWork, {noAck: false});//execution de la function doWork et à chaque retour, passage au message suivant.
          //console.log(' [*] Waiting for messages. To exit press CTRL+C');
        });
        return ok;

        function doWork(msg) {
          let body = msg.content.toString();
          console.log(' [x] Received \'%s\'', body);
          let secs = body.split('.').length - 1;
          let thread = JSON.parse(body);//récupération du message et on reparse le JSON encodé précédemment en string.

          //TODO traitement voulu (update de base, import de datas, etc...)

          //console.log(' [x] Task takes %d seconds', secs);
          setTimeout(function () {
            //console.log(' [x] Done');
            ch.ack(msg);//nettoyage du message.
          }, secs * 1000);
        }


      });
  }).catch(console.warn);
};


(function on_load() {
  import_consume();
})();