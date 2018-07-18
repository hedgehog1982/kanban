//for MongoDB
const mongoose = require('mongoose')
let mongoPath = process.env.MONGODB_PATH_KANBAN
var appFile = require('../app.js') // for accessing my variables

mongoose.connect(mongoPath);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected")
  getAllCards();
  getAllBoards()
  getAllUsers()
});

var cardSchema = new mongoose.Schema({
        _id: String,
        data : {
            name: String,
            comments: [{ user: String, comments: String, date: Date }],
            createdOn : Date,
            createdBy: String,
            description: String,
            lastUpdated : Date,
            users : [String]
            }
        })

var boardSchema = new mongoose.Schema({
    _id: String,
    data : {
        name: String,
        createdOn : Date,
        lastUpdated : Date,
        boards : [String]
        }
    })

    var userSchema = new mongoose.Schema({
            email : String,
            name : String
        })


let saveCard = (card) => {
    let Card = mongoose.model('Card', cardSchema)
    var newCard = new Card({_id : card.id, data : card.data});

    Card.findOneAndUpdate(
        
        {_id : card.id},
        newCard,
        {upsert: true, new: true, runValidators: true}, // options
        function (err, doc) { // callback
            if (err) {
                console.log("Error")
                // handle error
            } else {
                console.log("Added")
                // handle document
            }
        }
    )
};

let saveBoard = (board) => {
    let Board = mongoose.model('Board', boardSchema)
    var newBoard = new Board({_id : board.id, data : board.data});

    Board.findOneAndUpdate(
        
        {_id : board.id},
        newBoard,
        {upsert: true, new: true, runValidators: true}, // options
        function (err, doc) { // callback
            if (err) {
                console.log("Error")
                // handle error
            } else {
                console.log("Added")
                // handle document
            }
        }
    )
};

let saveUser = (user, name) => {
    let User = mongoose.model('User', userSchema)
    var newUser = new User({email : user});

    User.findOneAndUpdate(
        {email : user},
        newUser,
        {upsert: true, new: true, runValidators: true}, // options
        function (err, doc) { // callback
            if (err) {
                console.log("Error")
                // handle error
            } else {
                console.log("Added User")
                // handle document
            }
        }
    )
};

let getAllCards = () => {
    let Card = mongoose.model('Card', cardSchema)

    //find all cards
    Card.find({}, function(err, cards) {
         cards.forEach(function(card) {
            appFile.kanbanCards[card._id] = card.data
        });
      });
}

let getAllBoards = () => {
    let Board = mongoose.model('Board', boardSchema)

    //find all cards
    Board.find({}, function(err, boards) {
         boards.forEach(function(board) {
            appFile.kanbanBoards[board._id] = board.data
        });
      });
}

let getAllUsers = () => {
    let User = mongoose.model('User', userSchema)

    //find all cards
    User.find({}, function(err, users) {
         users.forEach(function(user) {

            appFile.userList[user.email] = {}
        });
        console.log(appFile.userList)
      });
}

 module.exports = {db, saveCard, saveBoard, saveUser};

