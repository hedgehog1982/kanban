//-------------------- board menu buttons -------------------//
const makeABoardButton = id => {
    let button = creatElementWithAClass('div', []);
    button.id = `${id}-button`;
    button.innerHTML = '<i class="material-icons">apps</i>';
    return button;
};

//---------------------- board menu ---------------------------//
const makeABoardMenu = id => {
    //----------------------------- menu --------------------------//
    // menu header
    let aNewMenu = creatElementWithAClass('div', ['menus']);
    aNewMenu.style.display = 'none';
    aNewMenu.innerHTML = 'Menu Options';

    //menu items
    let deleteButton = creatElementWithAClass('div', []);
    deleteButton.innerHTML = 'ARCHIVE BOARD';
    deleteButton.onclick = function() {
        archiveBoard(id);
        aNewMenu.remove();
    };

    aNewMenu.appendChild(deleteButton);
    return aNewMenu;
};

//-----------for making menu popout return menu button with event listeners----------------------//

const makeAMenuPopOutOfTheButton = (menuButton, menu, keepFocus) => {
    menu.id = 'board-menu';
    menuButton.onclick = function() {
        //check to see if
        let oldMenus = document.getElementById('board-menu');
        //if its the same button hide it
        if (oldMenus === menu) {
            console.log('same button');
            oldMenus.remove();
        } else {
            if (oldMenus !== null) {
                oldMenus.remove();
                menu.style.display = 'block';
                document.body.appendChild(menu);
            } else {
                menu.style.display = 'block';
                document.body.appendChild(menu);
            }
        }

        //Make sure the menu is in the correct place // find out where the button is
        menu.style.top =
            menuButton.getBoundingClientRect().bottom +
            window.pageYOffset +
            'px';
        menu.style.left =
            menuButton.getBoundingClientRect().x + window.pageXOffset + 'px';
    };

    if (keepFocus !== true) {
    // remove menu on focus out
    const removeMenu = () => {
        //e.preventDefault()
        let oldMenus = document.getElementById('board-menu');
        //if its the same button hide it
        if (oldMenus === menu) {
            oldMenus.remove();
        }
    };
    menu.tabIndex = 0;
    menu.addEventListener('focusout', removeMenu, true);
    }

    //return menu button with event listener
    return menuButton;
};

//------------------------------------------------------------------------------------//
