var common     = require('../../common');
var assert     = require('assert');

var rows;
var fields;
var err;
var server;

function test() {
  var pool = common.createPool();
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT 123', function(err, _rows, _fields) {
      if (err) throw err;

      assert.equal(pool._allConnections.length > 0, true);
      rows = _rows;
      fields = _fields;
      server.connections.forEach(function(conn) {
      	conn.stream.end();
      });
      assert.equal(pool._allConnections.length === 0, true);
    });
  })
}

function serverHandler(conn) {
  conn.on('query', function(q) {
    conn.writeTextResult([ { '1': '1' } ], [ { catalog: 'def',
     schema: '',
     table: '',
     orgTable: '',
     name: '1',
     orgName: '',
     characterSet: 63,
     columnLength: 1,
     columnType: 8,
     flags: 129,
     decimals: 0 } ]);
  });
}
server = common.createServer(test, serverHandler);

process.on('exit', function() {
  assert.deepEqual(rows, [{1: 1}]);
  assert.equal(fields[0].name, '1');
});
