// ----------------- Generate DOM objects           ----------------------//
//create comment

const createComment = (commentObject, commentIndex, id) => {
    let div = document.createElement('div');
    div.style.width = '100%';

    let commentsSection = document.getElementById('comment-section');

    let comment = document.createElement('div');
    let date = new Date(commentObject.date);
    let minutes = ('0' + date.getMinutes()).slice(-2); // for 2Dp
    let hours = ('0' + date.getHours()).slice(-2); // for 2Dp
    comment.innerHTML = `
    ${
        commentObject.user
    } posted on ${date.toLocaleDateString()} at ${hours}:${minutes} <br>
    ${commentObject.comment} `;

    div.appendChild(comment);

    if (commentObject.user === user) {
        let deleteButton = createButton('delete');

        deleteButton.onclick = () => {
            kanbanCards[id]['comments'].splice(commentIndex, 1);
            updateCommentDiv(id);
            changeDonePushChange();
        };
        div.appendChild(deleteButton);
    }

    commentsSection.appendChild(div);
    let hr = document.createElement('hr');
    commentsSection.appendChild(hr);
};

//create card
const createCard = id => {
    let div = creatElementWithAClass('div', ['item'], `${id}-card`);
    div.draggable = true;

    let hasDescription = '';
    let hasComments = '';
    let pageBreak = '';

    //display comment and description icons
    if (kanbanCards[id] !== undefined) {
        if (
            kanbanCards[id].comments.length !== 0 ||
            kanbanCards[id].description.length !== 0
        ) {
            pageBreak = `<br> <br>`;
        }
        hasComments =
            kanbanCards[id].comments.length === 0
                ? ''
                : `<i class="material-icons">
                comment
                </i> ${kanbanCards[id].comments.length}`;
        hasDescription =
            kanbanCards[id].description.length === 0
                ? ''
                : `&nbsp <i class="material-icons">notes</i>`;
    }

    //display users 
    let userDivIcons = creatElementWithAClass("div", ["userList"])
    let usersAttachedToCard = kanbanCards[id].users
        usersAttachedToCard.forEach(users => {
            let userIconDiv = creatElementWithAClass("div", ["roundIcon"])
            let wordArray = users.split(" ")
            let firstLetters = ""
               firstLetters += wordArray[0][0].toUpperCase()
               if (wordArray.length > 2){
                    firstLetters += wordArray[1][0].toUpperCase()
               } 
            console.log(firstLetters)
            userIconDiv.innerHTML =firstLetters
               //popout?

               let chooseUserMenu = checkBoxforUser (users , id)

               chooseUserMenu = makeAMenuPopOutOfTheButton(userIconDiv, chooseUserMenu)
               chooseUserMenu.style.display = "flex"

            userDivIcons.appendChild(userIconDiv)
        })
        

    //
            //title of card
            div.innerHTML = `${
                kanbanCards[id]['name']
            } ${pageBreak} ${hasDescription}  &nbsp ${hasComments}`;

            div.appendChild(userDivIcons)


    div.ondragstart = function() {
        drag(event);
    };

    //on click - display modal
    div.onclick = function(e) {
        let card = this.id.split('-')[0];
        let board = this.parentNode.id.split('-')[0];
        killMenu()
        displayModal(board, card, kanbanCards[card]);
    };
    return div;


};

//create a board
const createBoard = id => {
    //create board and add id and class
    let board = creatElementWithAClass('div', ['board'],`${id}-board`);

    //create headers
    let headerContainer = creatElementWithAClass('div', ['board-header']);

    let header = creatElementWithAClass('h2', ['board-heading']);
    header.innerHTML = kanbanBoards[id]['name'];
    headerContainer.appendChild(header);

    let archiveButton = makeABoardButton(id)
    let boardMenu= makeABoardMenu(id)
    
    boardMenu = makeAMenuPopOutOfTheButton(archiveButton, boardMenu);

    headerContainer.appendChild(boardMenu);

    //end of menu in header

    //allow drag and drop onto header
    //allow drag and drop on board
    board.ondrop = () => drop(event);

    board.ondragover = () => allowDrop(event);

    header.ondrop = () => drop(event);

    header.ondragover = () => allowDrop(event);

    header.onclick = function() {
        let div = this;
        renameBoard(div, id, renameBoardOnObject); //
    };

    //create content and add id
    let content = creatElementWithAClass('div', ['content'],`${id}-content`);

    //create button

    let button = createButton('Add a Card');
    button.onclick = function() {
        addCardOrBoard(this, 'card');
    };

    //add button to content
    //append all to board

    board.appendChild(headerContainer);
    board.appendChild(content);
    board.appendChild(button);

    return board;
};

// Rename Board (and also description and title)

const renameBoard = (div, id, funcToCall, type) => {
    console.log('Renaming');
    let editTitle = document.createElement('textArea');
    text = div.innerHTML;

    editTitle.innerHTML = text.replace(/<br\s*[\/]?>/gi, '\n');
    copyNodeStyle(div, editTitle); //copy style to other node

    editTitle.style.overflowY = 'hidden';

    const expandTextArea = () => {
        if (editTitle.scrollHeight !== editTitle.style.height.slice(0, -2)) {
            editTitle.style.height = editTitle.scrollHeight + 'px';
        }
    };

    ['keyup', 'keydown', 'paste', 'cut', 'change'].forEach(evt =>
        editTitle.addEventListener(evt, expandTextArea, false)
    );

    //copy style from previous ?

    div.parentNode.replaceChild(editTitle, div);
    editTitle.focus();

    let renameAndReplaceDiv = () => {
        let newName = editTitle.value.trim();
        div.innerHTML = newName.replace(/(?:\r\n|\r|\n)/g, '<br>');
        editTitle.parentNode.replaceChild(div, editTitle);
        funcToCall(id, newName);
    };

    //having to rename these so i can cancel them
    let pressedEnter = e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (editTitle.value.trim().length !== 0 || type === 'allow empty') {
                editTitle.removeEventListener('focusout', lostFocus);
                renameAndReplaceDiv();
            }
        }
    };

    let lostFocus = e => {
        e.preventDefault();
        editTitle.removeEventListener('keypress', pressedEnter);
        if (editTitle.value.trim().length !== 0 || type === 'allow empty') {
            renameAndReplaceDiv();
        } else {
            editTitle.parentNode.replaceChild(div, editTitle);
        }
    };

    //if type is rename card this is being done through the modal and needs the div-id altering

    //event listeners
    //allow pressing of enter for description
    if (type !== 'allow empty') {
        editTitle.addEventListener('keypress', pressedEnter, false);
    }

    editTitle.addEventListener('focusout', lostFocus, false);
};

const creatElementWithAClass = (type, classArray, id) => {
    let anElement = document.createElement(type);
    classArray.forEach(type => {
        anElement.classList.add(type);
    });
    if (id !== undefined){
        anElement.id = id
    }
    return anElement;
};

//------------------ DOM BUTTONS --------------------//
//make a button to make things easier
const createButton = name => {
    let button = document.createElement('button');
    button.innerHTML = name;
    return button;
};

const createNewBoardButton = () => {
    let div = creatElementWithAClass('div', ['board'],'addBoard');

    let button = createButton('Add a board');

    button.onclick = function() {
        addCardOrBoard(this, 'board');
    };

    button.classList.add('boardButton');
    div.appendChild(button);
    return div;
};
