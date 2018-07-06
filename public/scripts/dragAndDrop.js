//-------------------------- FOR DRAG DROP EVENTS ---------------------------//
const allowDrop = ev => {
    ev.preventDefault();
};

const drag = ev => {
    ev.dataTransfer.setData('text', ev.target.id);
};

const drop = ev => {
    //to allow dropping
    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');

    //to stop you dragging into each other
    //dropping onto another card will place it afer that card but before button
    //dropping it in gaps will put it at the end
    if (ev.target.className === 'content' || ev.target.className === 'board') {
        let buttonNode = '';
        for (let i = 0; i < ev.target.childNodes.length; i++) {
            if ((ev.target.childNodes[i].localName = 'button')) {
                buttonNode = ev.target.childNodes[i - 1]; //starts counting at 1?
            }
        }
        //make sure we update where it has changed to
        moveCardToNewBoard(data, ev.target.id);

        ev.target.insertBefore(document.getElementById(data), buttonNode);
    } else if (
        ev.target.className === 'item' ||
        ev.target.className === 'board-header' ||
        ev.target.className === 'board-heading'
    ) {
        let index = 0
        let targetNode = ev.target;
        let parentDiv = ev.target.parentNode;
        if (ev.target.tagName === 'H2'){
            parentDiv = ev.target.parentNode.parentNode
            targetNode = ev.target.parentNode
        }

        if (ev.target.className === 'item'){
            let board = parentDiv.id.split("-")[0]
            let cards = targetNode.id.split("-")[0]
           index = kanbanBoards[board]["boards"].indexOf(cards)
        } 
        parentDiv.insertBefore(
            document.getElementById(data),
            targetNode.nextSibling
        );
        moveCardToNewBoard(data, parentDiv.id, index);
    }
};
