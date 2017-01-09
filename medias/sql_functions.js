exports.select = function select(connection, table, id, callback) {
	connection.query("Select * from ?? where id = ?", [table, id], function (err, rows) {
		if (err) throw err;
		callback(null, rows)
	})
}