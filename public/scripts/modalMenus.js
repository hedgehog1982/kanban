// Generate Board Menu's
const generateBoardSelectionMenu = (id) =>{
let boardSelectionMenu = creatElementWithAClass("div",["dropdown"])
    
    let boards = Object.keys(kanbanBoards);
    boards.forEach(board => {
        let boardMenuItem = creatElementWithAClass('div',["dropdown-content"]);
        boardMenuItem.innerHTML = kanbanBoards[board].name;
        boardMenuItem.onclick = () => {
            moveCardToNewBoard(id, board, 0);
            redrawEverything();
            addDetailToModal(id); //regenerate modal after change
        };
        boardSelectionMenu.appendChild(boardMenuItem);
    })
    return boardSelectionMenu
}

//generate index positions
const generateIndexPositionsMenu = (id) => {
    let positionSelectionMenu = creatElementWithAClass("div",["dropdown"])
    let currentBoard = findCardsBoard(id);
    let positions = kanbanBoards[currentBoard]['boards'].length;
    for (let i = 0; i < positions; i++) {
        let boardMenuItem = creatElementWithAClass('div',["dropdown-content"]);
        boardMenuItem.innerHTML = `Move to ${i + 1}`;
        boardMenuItem.onclick = () => {
            moveCardToNewBoard(id, currentBoard, i);
            addDetailToModal(id); //regenerate modal after change
        };
        positionSelectionMenu.appendChild(boardMenuItem);
    }
        return positionSelectionMenu
}