// ------------------SOCKET IO AND EVENTS------------------------//

// update has happened on the board (server pulled new content or another user has updateed)
const generateNewBoardAfterUpdate = msg => {
    console.log(msg)

    archivedBoards = msg.archivedBoards
    kanbanBoards = msg.currentBoards
    kanbanCards = msg.currentCards
    userList = msg.userList

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
socket.on('LOAD', function(msg) {
    console.log('LOADING');
    generateNewBoardAfterUpdate(msg);
});

socket.on('reconnect_error', () => {
    console.log('attempt to reconnect has failed woop woop');
    // retrieve database from local storage
  });