// ------------------WRITING TO OBJECT -----------------------//
//add board to data structure
const addBoardToObject = (name, id) => {
    name = name.replace(/(\r\n\t|\n|\r\t)/gm, '');

    //for new way
    kanbanBoards[id] = { name, boards: [] };
    redrawEverything();
    changeDonePushChange();
};

// add card to board in data structure
const addCardToBoard = (name, boardName, id) => {
    let nameOfBoard = boardName.split('-')[0];
    //remove all white space except for space
    name = name.replace(/(\r\n\t|\n|\r\t)/gm, '');

    kanbanBoards[nameOfBoard]['boards'].push(id);
    kanbanCards[id] = {
        name,
        createdOn: new Date(),
        createdBy: user,
        description: '',
        comments: [],
        users : []
    };
    redrawEverything();
    changeDonePushChange();
};

//card moved to new board
const moveCardToNewBoard = (cardName, newBoard, index) => {

    newBoard = newBoard.split('-')[0];
    cardName = cardName.split('-')[0];

    let oldBoard = findCardsBoard(cardName);

    //find old key
    let cardInArray = kanbanBoards[oldBoard]['boards'].indexOf(cardName);
    kanbanBoards[oldBoard]['boards'].splice(cardInArray, 1);
    if (index < 0) {
        kanbanBoards[newBoard]['boards'].push(cardName);
    } else {
        kanbanBoards[newBoard]['boards'].splice(index, 0, cardName);
    }
    redrawEverything();
    changeDonePushChange();
};

const renameBoardOnObject = (id, name) => {
    kanbanBoards[id].name = name;
    changeDonePushChange();
};

const renameTitle = (id, name) => {
    kanbanCards[id].name = name;
    redrawEverything();
    changeDonePushChange();
};

const renameDescription = (id, description) => {
    kanbanCards[id].description = description;
    redrawEverything();
    changeDonePushChange();
};

const addComment = (id) => {
    let comment = document.getElementById('comment').value;
    if (comment.trim().length !== 0) {
        kanbanCards[modalOpen]['comments'].push({
            user,
            comment,
            date: new Date()
        });
    }
    updateCommentDiv(id);
    redrawEverything();
    changeDonePushChange();
};

const addUser = (id, user) => {
    kanbanCards[id].users.push(user)
    redrawEverything();
    changeDonePushChange()
}

const removeUser = (id, user) => {
    let indexOfUser = kanbanCards[id].users.indexOf(user)
    kanbanCards[id].users.splice(indexOfUser, 1)
    redrawEverything();
    changeDonePushChange()
}

const archiveBoard = (id) => {
    console.log("archiving board ", kanbanBoards[id].name)
    archivedBoards[id] = kanbanBoards[id]
    delete kanbanBoards[id]
    changeDonePushChange();
    redrawEverything();
}
