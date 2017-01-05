var localDatabase = {};
var dbName = "NewsDB3";
localDatabase.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

function initDatabase(schemas, fn) {
	var openRequest = localDatabase.indexedDB.open(dbName, 1);
	openRequest.onerror = function() {
		console.log("数据库创建失败")
	};
	openRequest.onsuccess = function() {
		console.log("数据库创建成功");
		localDatabase.db = openRequest.result;
		fn()
	};
	openRequest.onupgradeneeded = function(e) {
		for(var key in schemas) {
			var newStore = e.currentTarget.result.createObjectStore(key, {
				keyPath: "id",
				autoIncrement: true
			});
			newStore.createIndex("urlIndex", "url", {
				unique: true
			});
			newStore.createIndex("idIndex", "id", {
				unique: true
			})
		}
	}
}

function addNews(tablename, data, fn) {
	var count = data.length;
	for(var i = 0; i < data.length; i += 1) {
		addItem(tablename, data[i], function() {
			count -= 1;
			if(count == 0) {
				fn()
			}
		})
	}
}

function addItem(tablename, data, fn) {
	var transaction = null;
	var store = null;
	transaction = localDatabase.db.transaction(tablename, "readwrite");
	store = transaction.objectStore(tablename);
	var request = store.add(data);
	transaction.oncomplete = fn;
	transaction.onabort = fn
}

function queryMax(tablename, fn) {
	var transaction = null;
	var store = null;
	transaction = localDatabase.db.transaction(tablename, "readwrite");
	store = transaction.objectStore(tablename);
	var request = store.index("idIndex").openCursor(null, "prevunique");
	request.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			fn(cursor.key)
		}
	}
}

function fetchNew(tablename, begin, pagecount, fn) {
	var result = [];
	var transaction = null;
	var store = null;
	transaction = localDatabase.db.transaction(tablename, "readwrite");
	store = transaction.objectStore(tablename);
	var range = window.IDBKeyRange.bound(begin - pagecount + 1, begin, false, false);
	var request = store.index("idIndex").openCursor(range, "prevunique");
	request.onsuccess = function(evt) {
		var cursor = evt.target.result;
		if(cursor) {
			result.push(cursor.value);
			cursor.continue()
		} else {
			fn(result)
		}
	}
}