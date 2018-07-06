// ------------------WRITING TO OBJECT -----------------------//
//add board to data structure
const addBoardToObject = (name, id) => {
    name = name.replace(/(\r\n\t|\n|\r\t)/gm, '');

    //for new way
    kanbanBoards[id] = { name, boards: [] };

    changeDonePushChange();
};

// add card to board in data structure
const addCardToBoard = (name, boardName, id) => {
    let nameOfBoard = boardName.split('-')[0];
    //remove all white space except for space
    name = name.replace(/(\r\n\t|\n|\r\t)/gm, '');

    kanbanBoards[nameOfBoard]['boards'].push(id)
    kanbanCards[id] = { name ,createdOn : new Date(), createdBy : user, description : "", comments : []}

    changeDonePushChange();
};

//card moved to new board
const moveCardToNewBoard = (cardName, newBoard, index ) => {

        newBoard = newBoard.split('-')[0];
        cardName = cardName.split('-')[0];

        let oldBoard = findCardsBoard(cardName)

            //find old key
            let cardInArray = kanbanBoards[oldBoard]['boards'].indexOf(cardName)
            kanbanBoards[oldBoard]['boards'].splice(cardInArray, 1)
            if (index < 0 ){
                kanbanBoards[newBoard]['boards'].push(cardName)
            } else {
                kanbanBoards[newBoard]['boards'].splice(index, 0, cardName)            
            }
        
        changeDonePushChange();
};

const renameBoardOnObject = (id, name) => {
    kanbanBoards[id].name = name
    changeDonePushChange();
}

const renameTitle = (id, name) => {
    kanbanCards[id].name = name
    changeDonePushChange();
}

const renameDescription = (id, description) => {
    kanbanCards[id].description = description
    changeDonePushChange();
}

const addComment = (id) => {
            let comment = document.getElementById('comment').value;
            if (comment.trim().length !== 0){
                kanbanCards[modalOpen]['comments'].push({user, comment, date : new Date()})
            }
            //updateCommentDiv(id)
            changeDonePushChange();
}