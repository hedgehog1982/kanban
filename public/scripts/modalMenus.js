// Generate Board Menu's
const generateBoardSelectionMenu = id => {
    let boardSelectionMenu = creatElementWithAClass('div', ['dropdown']);

    let boards = Object.keys(kanbanBoards);
    boards.forEach(board => {
        let boardMenuItem = creatElementWithAClass('div', ['dropdown-content']);
        boardMenuItem.innerHTML = kanbanBoards[board].name;
        boardMenuItem.onclick = () => {
            moveCardToNewBoard(id, board, 0);
            redrawEverything();
            addDetailToModal(id); //regenerate modal after change
        };
        boardSelectionMenu.appendChild(boardMenuItem);
    });
    return boardSelectionMenu;
};

//generate index positions
const generateIndexPositionsMenu = id => {
    let positionSelectionMenu = creatElementWithAClass('div', ['dropdown']);
    let currentBoard = findCardsBoard(id);
    let positions = kanbanBoards[currentBoard]['boards'].length;
    for (let i = 0; i < positions; i++) {
        let boardMenuItem = creatElementWithAClass('div', ['dropdown-content']);
        boardMenuItem.innerHTML = `Move to ${i + 1}`;
        boardMenuItem.onclick = () => {
            moveCardToNewBoard(id, currentBoard, i);
            addDetailToModal(id); //regenerate modal after change
        };
        positionSelectionMenu.appendChild(boardMenuItem);
    }
    return positionSelectionMenu;
};

//Make users menu
const generateUserMenu = id => {
    let userMenu = creatElementWithAClass('div', ['dropdown']);
    console.log(userList)
    let users = Object.keys(userList);
    users.forEach(user => {
         let boardUserItem = checkBoxforUser(user, id)
        userMenu.appendChild(boardUserItem);
    });

    return userMenu;
};

//--------------------------- checkbox --------------------//
const checkBoxforUser = (user , id) => {
        //make a clickable checkbox
        let boardUserItem = creatElementWithAClass('div', ['dropdown-content']);

        //add checkbox
        let checkBox = creatElementWithAClass('input', []);
        checkBox.type = 'checkbox';
        //need to check the checkbox if the user is in that id board
        if (kanbanCards[id].users.includes(user)) {
            checkBox.checked = true;
        }

        let boardUser = creatElementWithAClass('div', []);
        boardUser.innerHTML = user;
        boardUser.onclick = () => {
            if (checkBox.checked === true) {
                checkBox.checked = false;
                removeUser(id, user);
            } else {
                checkBox.checked = true;
                addUser(id, user);
            }
        };

        checkBox.onchange = () => {
            console.log('checkBox is ' + checkBox.checked);
            if (checkBox.checked === true) {
                addUser(id, user);
            } else {
                removeUser(id, user);
            }
        };

        boardUserItem.appendChild(checkBox);
        boardUserItem.appendChild(boardUser);
    return boardUserItem;
}