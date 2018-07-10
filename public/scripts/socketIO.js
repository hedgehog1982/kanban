// ------------------SOCKET IO AND EVENTS------------------------//

// update has happened on the board (server pulled new content or another user has updateed)
const generateNewBoardAfterUpdate = msg => {
    console.log(msg)
    archivedBoards = msg.archivedBoards
    kanbanBoards = msg.currentBoards
    kanbanCards = msg.currentCards
    userList = msg.listOfUsers
    redrawEverything()
};

///SOCKET IO CONNECTIONS HERE
socket.on('LOAD', function(msg) {
    console.log('LOADING');
    generateNewBoardAfterUpdate(msg);
});