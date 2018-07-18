// ------------------SOCKET IO AND EVENTS------------------------//

// update has happened on the board (server pulled new content or another user has updateed)
const generateNewBoardAfterUpdate = msg => {
    console.log(msg)
    redrawEverything()
    //store to local database
    writeAllToDB()

    request.onsuccess = function(event) {
        alert("Added to your database.");
     };
     
     request.onerror = function(event) {
        alert("Errors database! ");
     }
};

///SOCKET IO CONNECTIONS HERE

//load - full refresh
socket.on('LOAD', function(msg) {
    archivedBoards = msg.archivedBoards
    kanbanBoards = msg.kanbanBoards
    kanbanCards = msg.kanbanCards
    userList = msg.userList
    console.log('LOADING');
    console.log(msg)
    generateNewBoardAfterUpdate(msg);
});

//load - card Change
socket.on('cardChange', function(msg) {
    console.log('card LOADING', msg);
    kanbanCards[msg.id] = msg.data;
    generateNewBoardAfterUpdate(msg);
});

//load - board Chnage
socket.on('boardChange', function(msg) {
    console.log('board LOADING');
    kanbanBoards[msg.id] = msg.data;
    generateNewBoardAfterUpdate(msg);
});

socket.on('disconnect', () => {
    console.log('Socket has disconnected');
  });


socket.on('reconnect_error', () => {
    console.log('attempt to reconnect has failed woop woop');
        readAllFromDB() //will only read locally if no variables set up
    // retrieve database from local storage
  });