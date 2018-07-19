//for MongoDB
const mongoose = require('mongoose');
let mongoPath = process.env.MONGODB_PATH_KANBAN;
var appFile = require('../app.js'); // for accessing my variables

mongoose.connect(mongoPath);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Connected');
    getAllCards();
    getAllBoards(appFile.kanbanBoards, boardSchema, "Board",);
    getAllBoards(appFile.archivedBoards, archiveBoardSchema, "ArchiveBoard",);
    getAllUsers();
});


var cardSchema = new mongoose.Schema({
    _id: String,
    data: {
        name: String,
        comments: [{ user: String, comments: String, date: Date }],
        createdOn: Date,
        createdBy: String,
        description: String,
        lastUpdated: Date,
        users: [String]
    }
});

var boardSchema = new mongoose.Schema({
    _id: String,
    data: {
        name: String,
        createdOn: Date,
        lastUpdated: Date,
        boards: [String]
    }
});

var archiveBoardSchema = new mongoose.Schema({
    _id: String,
    data: {
        name: String,
        createdOn: Date,
        lastUpdated: Date,
        boards: [String],
        archivedOn : Date
    }
});

var userSchema = new mongoose.Schema({
    email: String,
    name: String
});


//------------------ SAVING / UPDATING TO DB --- really needs trimming down
let saveCard = card => {
    let Card = mongoose.model('Card', cardSchema);
    var newCard = new Card({ _id: card.id, data: card.data });

    Card.findOneAndUpdate(
        { _id: card.id },
        newCard,
        { upsert: true, new: true, runValidators: true }, // options
        function(err, doc) {
            // callback
            if (err) {
                console.log('Error');
                // handle error
            } else {
                console.log('Added');
                // handle document
            }
        }
    );
};

let saveBoard = board => {
    let Board = mongoose.model('Board', boardSchema);
    var newBoard = new Board({ _id: board.id, data: board.data });


    Board.findOneAndUpdate(
        { _id: board.id },
        newBoard,
        { upsert: true, new: true, runValidators: true }, // options
        function(err, doc) {
            // callback
            if (err) {
                console.log('Error');
                // handle error
            } else {
                console.log('Added');
                // handle document
            }
        }
    );
};

let archiveBoard = board => {
    let ArchiveBoard = mongoose.model('ArchiveBoard', archiveBoardSchema);
    board.data["archivedOn"] = new Date()
    console.log(board)
    var newBoard = new ArchiveBoard({ _id: board.id, data: board.data });

    ArchiveBoard.findOneAndUpdate(
        { _id: board.id },
        newBoard,
        { upsert: true, new: true, runValidators: true }, // options
        function(err, doc) {
            // callback
            if (err) {
                console.log('Error');
                // handle error
            } else {
                console.log('Added');
                // handle document
            }
        }
    );
};

let saveUser = (user, name) => {
    let User = mongoose.model('User', userSchema);
    var newUser = new User({ email: user });

    User.findOneAndUpdate(
        { email: user },
        newUser,
        { upsert: true, new: true, runValidators: true }, // options
        function(err, doc) {
            // callback
            if (err) {
                console.log('Error');
                // handle error
            } else {
                console.log('Added User');
                // handle document
            }
        }
    );
};

// -------------------- Delete a board (for archiving)
let deleteBoard = board => {
    let Board = mongoose.model('Board', boardSchema);
    Board.deleteOne(
        { _id: board.id },
        function(err, doc) {
            // callback
            if (err) {
                console.log('Error - Could not delete');
                // handle error
            } else {
                console.log('Removed Element');
                // handle document
            }
        }
    );
};

// -------------------- Get all elements for startup of server ----------//
let getAllCards = () => {
    let Card = mongoose.model('Card', cardSchema);

    //find all cards
    Card.find({}, function(err, cards) {
        cards.forEach(function(card) {
            appFile.kanbanCards[card._id] = card.data;
        });
    });
};

let getAllBoards = (savePath ,schema, type) => {
    let Board = mongoose.model(type, boardSchema);

    //find all cards
    Board.find({}, function(err, boards) {
        boards.forEach(function(board) {
            savePath[board._id] = board.data;
        });
    });
};

let getAllUsers = () => {
    let User = mongoose.model('User', userSchema);

    //find all cards
    User.find({}, function(err, users) {
        users.forEach(function(user) {
            appFile.userList[user.email] = {};
        });
    });
};

module.exports = { db, saveCard, saveBoard, deleteBoard, archiveBoard, saveUser };
