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
    let description =
        kanbanCards[id].description === undefined
            ? ''
            : kanbanCards[id].description;

    let comment = document.getElementById('comment');
    comment.value = '';

    let modalText = document.getElementById('modal-text');
    modalText.innerHTML = title;

    //section to do with boards
    let belongsToBoard = document.getElementById('belongsToBoard');
    belongsToBoard.innerHTML = `is on board : ${kanbanBoards[findCardsBoard(id)].name}`


    //------ FOR SWAPPING BOARD
    let dropDownButton = document.getElementById('dropDownBoard');
    dropDownButton.innerHTML = '';
    dropDownButton.appendChild(createDropDown(id, 'Move Board'));
    dropDownButton.appendChild(createDropDown(id, 'Move Position'));

    modalText.onclick = function() {
        let div = this;
        renameBoard(div, id, renameTitle); //
    };

    let modalDescription = document.getElementById('modal-description');
    //need carriage returns replaced with
    modalDescription.innerHTML = description.replace(/(?:\r\n|\r|\n)/g, '<br>');
    modalDescription.onclick = function() {
        let div = this;
        renameBoard(div, id, renameDescription, 'allow empty'); //
    };
};

//update comments below modal window
const updateCommentDiv = id => {
    let commentBox = document.getElementById('comment');
    commentBox.value = '';

    //clear ready to generate
    document.getElementById('comment-section').innerHTML = '';
    let reversedArray = kanbanCards[id]['comments'].reverse();
    reversedArray.forEach((comment, index) => {
        createComment(comment, index, id);
    });
};

//Allow closing of modal
document.getElementById('closeModal').addEventListener('click', () => {
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
        addComment(modalOpen);
    }
});
