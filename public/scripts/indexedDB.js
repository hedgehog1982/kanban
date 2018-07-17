//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var db;
var request = window.indexedDB.open("newDatabase", 2);


request.onerror = function(event) {
    console.log("error: ");
 };
 
 request.onsuccess = function(event) {
    db = request.result;
    console.log("success: "+ db);
 };

 request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("new", {keyPath: "id"});
 }

const writeAllToDB= () => {
    console.log("write to DB", kanbanBoards)
    var request = db.transaction(["new"], "readwrite")
   .objectStore("new")
   request.delete("kanbanBoards")
   request.add({id : "kanbanBoards", items: kanbanBoards})

    request = db.transaction(["new"], "readwrite")
   .objectStore("new")
   request.delete("kanbanCards")
   request.add({id : "kanbanCards", items : kanbanCards})

}

const readAllFromDB = () => {
    if (kanbanBoards.length === 0) {// no boards imported (new connection and server disconnected)
    let transaction = db.transaction("new", 'readonly')
    let objectStore = transaction.objectStore("new")
    


    objectStore.getAll().onsuccess = function(event) {
        console.log(event.target)
        kanbanBoards = event.target.result[0].items
        kanbanCards = event.target.result[1].items
        redrawEverything()
        needToPullFromDBAsConnectionHasBeenLost = false
      };
}
}