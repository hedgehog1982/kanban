// ----------------- MODALS----------------------//

//display modal
const displayModal = (board, id, cardObject) => {
    updateCommentDiv(id);
    addDetailToModal(id);

    //set to view
    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modalOpen = id;
};

// add detail to modal -- will add to this bit heavily but not yet
const addDetailToModal = id => {

    let title = kanbanCards[id].name;
    let description = kanbanCards[id].description;

    let comment = document.getElementById('comment');
    comment.value = '';

    let modalText = document.getElementById('modal-text');
    if (modalText !== undefined ){
        modalText.innerHTML = title;
    }

    //section to do with boards
    let belongsToBoard = document.getElementById('belongsToBoard');
    belongsToBoard.innerHTML = `is on board : ${kanbanBoards[findCardsBoard(id)].name}`

    //------ FOR SWAPPING BOARD
    let dropDownButton = document.getElementById('dropDownBoard');
    dropDownButton.innerHTML = '';


    //make a move board button and menu
    let moveBoardButton = creatElementWithAClass("div",["dropbtn"])
    moveBoardButton.innerHTML = "Move Board"
    let boardSelectionMenu = generateBoardSelectionMenu(id)
    moveBoardButton = makeAMenuPopOutOfTheButton(moveBoardButton, boardSelectionMenu);
    dropDownButton.appendChild(moveBoardButton)

    // make a move position button 
    let movePositionButton = creatElementWithAClass("div",["dropbtn"])
    movePositionButton.innerHTML = "Move Position"
    let positionsMenu = generateIndexPositionsMenu(id)
    positionsMenu = makeAMenuPopOutOfTheButton(movePositionButton, positionsMenu)
    dropDownButton.appendChild(movePositionButton)

    modalText.onclick = function() {
        let div = this;
        renameBoard(div, id, renameTitle, "rename_card"); //
    };

    let modalDescription = document.getElementById('modal-description');
    if (modalDescription !== null) {
    //need carriage returns replaced with
    modalDescription.innerHTML = description.replace(/(?:\r\n|\r|\n)/g, '<br>');
    modalDescription.onclick = function() {
        let div = this;
        renameBoard(div, id, renameDescription, 'allow empty'); //
    };

    }
};

//update comments below modal window
const updateCommentDiv = id => {
    //clear text box
    let commentBox = document.getElementById('comment');
    commentBox.value = '';

    //clear ready to generate reverse date order
    let commentSection = document.getElementById('comment-section')
    commentSection.innerHTML = '';
    if (kanbanCards[id]['comments'].length !== 0){
        document.getElementById('commentHeader').style.display = "block"
    } else {
        document.getElementById('commentHeader').style.display = "none"
    }

    let reversedArray = kanbanCards[id]['comments'].reverse();
    reversedArray.forEach((comment, index) => {
        createComment(comment, index, id);
    });
};

//Allow closing of modal
document.getElementById('closeModal').addEventListener('click', () => {
    killMenu()
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
    modalOpen = ''; //set the fact that modal is shut
});

// --------------------------- PREVENT MODAL SUBMIT BREAKING  --------------//
//prevent default form submit
document
    .getElementById('modal-submit')
    .addEventListener('click', function(event) {
        event.preventDefault();
    });

//----------------------------

//event listener to listen for save and action
document.getElementById('modal-submit').addEventListener('click', () => {
    if (modalOpen.length !== 0) {
        console.log("is this firing?")
        addComment(modalOpen);
    }
});
