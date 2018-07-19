let kanbanBoards = {}
let kanbanCards = {}
let archivedBoards = {}
let archivedCards = {}
let userList = {}
let modalOpen = ""

const socket = io('http://localhost:8080');

const redrawEverything = () => {
    let boards = Object.keys(kanbanBoards);

    //clear all divs
    document.getElementById('boards').innerHTML = '';

    // for each board
    boards.forEach(board => {
        var newBoard = createBoard(board);
        //find button in node to allow inserting before
        let buttonNode = '';
        for (let i = 0; i < newBoard.childNodes.length; i++) {
            if ((newBoard.childNodes[i].localName = 'button')) {
                buttonNode = newBoard.childNodes[i]; //starts counting at 1?
            }
        }

        //add all cards to board, get keys and populate
        let cards = (kanbanBoards[board]['boards']);
        cards.forEach(card => {
            let newCard = createCard(
                card
            );
            //newBoard.insertBefore(newCard, buttonNode);
            newBoard.childNodes[1].appendChild(newCard)
        });

        //add populated board
        document.getElementById('boards').appendChild(newBoard);
    });

    //add new board button and etrieve archive boards button

    document.getElementById('boards').appendChild(createNewBoardAndRetrieveButton());
   //document.getElementById('boards').appendChild(retrieveBoardButton());
    //kanbanStructure = JSON.parse(JSON.stringify(newKanbanStructure));

    if (modalOpen.length !== 0){
        updateCommentDiv(modalOpen)
        addDetailToModal(modalOpen)
    }

}



