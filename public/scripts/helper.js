// ------------------ HELPER FUNCTIONS ----------------------//
//Generate a random string as a unique indentifier 6 n40
const randomStringGenerator = () => {
    let randomString = '';

    for (let i = 0; i < 10; i++) {
        randomString =
            randomString +
            Math.random()
                .toString(36)
                .substring(7);
    }
    return randomString;
};

//push change that we have done // may add what has changed and by who so
const changeDonePushChange = () => {
    writeAllToDB()
    socket.emit('CHANGE', {kanbanBoards, kanbanCards, archivedBoards, userList});
    return false;
};

const changeDoneToBoardPushChange = (id) => {
   // writeAllToDB()
    socket.emit('boardChange', {id, data : kanbanBoards[id]});
    return false;
};

const changeDoneToCardPushChange = (id) => {
    // writeAllToDB()
     socket.emit('cardChange', {id, data : kanbanCards[id]});
     return false;
 };


const copyNodeStyle = (sourceNode, targetNode) => {
    const computedStyle = window.getComputedStyle(sourceNode);
    Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
  }


//Find which board a card belongs to 

const findCardsBoard = (id) => {
    let oldBoard = ""
    let boardKeys = Object.keys(kanbanBoards);
    boardKeys.forEach(board => {
        if (kanbanBoards[board]["boards"].includes(id) === true) {
            oldBoard = board
        }
    })
    return oldBoard
}

// if menu is on screen remove it 
const killMenu = () =>{
    let menu = document.getElementById('board-menu')
    if (menu !== null) {
        menu.remove()
    }
}
