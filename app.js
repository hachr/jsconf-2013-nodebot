var five = require("johnny-five"),
  board, servo;

var temporal = require("temporal");

board = new five.Board();

var servos = null;

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}


var map = {
  "10": function () {
    bot.forward();
  },
  "12": function () {
    bot.backward();
  },
  "11": function () {
    bot.stop();
  },
  "01": function () {
    bot.hardLeft();
  },
  "00": function () {
    bot.forwardLeft();
  },
  "20": function () {
    bot.backwardLeft();
  },
  "02": function () {
    bot.forwardRight();
  },
  "22": function () {
    bot.backwardRight();
  },
  "21": function () {
    bot.hardRight();
  }
};

var bot = null;
io.sockets.on('connection', function (socket) {

  socket.on('move', function (data) {
    map[data.x + "" + data.y]();
  });
//  socket.on('stop', function (data) {
//    console.log("stopping!!");
//    bot.stop();
//  });
//
//  socket.on('forward', function (data) {
//    console.log("resuming!!");
//    bot.forward();
//  });
//
//  socket.on('backward', function (data) {
//    console.log("backward!!");
//    bot.backward(data);
//  });
//
//  socket.on('left', function (data) {
//    console.log("left!!");
//    bot.left(data);
//  });
//  socket.on('right', function (data) {
//    console.log("right!!");
//    bot.right(data);
//  });
//  socket.on('hardLeft', function (data) {
//    console.log("hardLeft!!");
//    bot.left(data);
//  });
//  socket.on('hardRight', function (data) {
//    console.log("hardRight!!");
//    bot.right(data);
//  });
});

board.on("ready", function () {
  servos = {
    leftWheel: five.Servo({
      pin: "O0",
      type: "continuous"
    }),
    rightWheel: five.Servo({
      pin: "O1",
      type: "continuous"
    }),
    leftArm: five.Servo({
      pin: "O2"
    }),
    rightArm: five.Servo({
      pin: "O3"
    })
  };

  bot = new Bot(servos);
  bot.stop();
  bot.forward();
  board.repl.inject({
    servos: servos,
    bot: bot
  });


});


var Bot = function (servos) {
  this.leftWheel = servos.leftWheel;
  this.rightWheel = servos.rightWheel;
  this.leftArm = servos.leftArm;
  this.rightArm = servos.rightArm;
  this.direction = 0;
}


Bot.prototype = {
  forward: function () {
    this.direction = 1;
//    temporal.queue([
//      {delay: 500, task: function () {
//        this.leftWheel.move(180);
//        this.rightWheel.move(0);
//      }}
//    ]);
    this.leftWheel.move(180);
    this.rightWheel.move(0);

  },
  backward: function () {
    this.leftWheel.move(0);
    this.rightWheel.move(180);

//    temporal.queue([
//      {delay: 500, task: function () {
//        this.leftWheel.move(0);
//        this.rightWheel.move(180);
//      }}
//    ]);
    this.direction = -1;
  },
  stop: function () {
    this.leftWheel.move(90);
    this.rightWheel.move(90);
    this.direction = 0;
  },

  hardLeft: function () {
    this.leftWheel.move(0);
    this.rightWheel.move(0);
  },
  forwardLeft: function () {
    this.rightWheel.move(0);
    this.leftWheel.move(90);
  },
  backwardLeft: function () {
    this.rightWheel.move(90);
    this.leftWheel.move(180);
  },
  hardRight: function () {
    this.leftWheel.move(180);
    this.rightWheel.move(180);
  },
  forwardRight: function () {
    this.rightWheel.move(90);
    this.leftWheel.move(0);
  },
  backwardRight: function () {
    this.rightWheel.move(180);
    this.leftWheel.move(90);
  }
};
