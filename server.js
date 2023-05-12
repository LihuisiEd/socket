var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var client = new kafka.KafkaClient();
var producer = new Producer(client);

app.listen(3000);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function handler(req, res) {
  res.writeHead(200);
  res.end('¡Hola, mundo!');
}

io.on('connection', function(socket) {
  console.log('Nuevo cliente conectado');

  socket.on('message', function(msg) {
    console.log('Mensaje recibido: ' + msg);

    // Enviar el mensaje a Kafka
    var payloads = [{ topic: 'my-topic', messages: msg }];
    producer.send(payloads, function(err, data) {
      if (err) {
        console.log('Error al enviar mensaje a Kafka: ' + err);
      } else {
        console.log('Mensaje enviado a Kafka: ' + JSON.stringify(data));
      }
    });
  });
});

producer.on('ready', function() {
  console.log('Productor de Kafka listo');
});

producer.on('error', function(err) {
  console.log('Error en el productor de Kafka: ' + err);
});
