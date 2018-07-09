let kanbanBoards = {}
let kanbanCards = {}
let archivedBoards = {}
let archivedCards = {}
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
            newBoard.insertBefore(newCard, buttonNode);
        });

        //add populated board
        document.getElementById('boards').appendChild(newBoard);
    });

    document.getElementById('boards').appendChild(createNewBoardButton());
    //kanbanStructure = JSON.parse(JSON.stringify(newKanbanStructure));

    if (modalOpen.length !== 0){
        updateCommentDiv(modalOpen)
        addDetailToModal(modalOpen)
    }

}



