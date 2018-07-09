//---------------------------ADD A CARD or board--------------------//

const addCardOrBoard = (tag, type) => {
    let div = document.createElement('div');
    div.classList.add('content');

    let textBox = document.createElement('textArea');

    let addButton = createButton('ADD');
    let cancelButton = createButton('CANCEL');

    //on add, add either a card or board
    addButton.onclick = function(event) {

        //generate unique id
        let id = randomStringGenerator();
        //add card or add board

        if (type === 'card' && textBox.value.length !== 0 && textBox.value.trim() !== '') {  
            addCardToBoard(textBox.value.trim(), div.parentNode.id, id)
        } else if (textBox.value.length !== 0 && textBox.value.trim() !== '') {
            addBoardToObject(textBox.value.trim(), id);
        }

    };

    //when we click cancel swap the add card back again
    cancelButton.onclick = function() {
        div.parentNode.replaceChild(tag, div);
    };

    //make a DIV For adding
    div.appendChild(textBox);
    div.appendChild(addButton);
    div.appendChild(cancelButton);

    //swap add button with newly created text box
    tag.parentNode.replaceChild(div, tag);

    //text box automatically editable
    textBox.focus()
};