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

const employeeData = [
   { id: "00-01", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
   { id: "00-02", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
];
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
    objectStore.getAll().onsuccess = function(event) {
        console.log(event)
      };




}