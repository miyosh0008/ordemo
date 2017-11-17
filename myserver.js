var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

app.use(bodyParser.json());

var connAttrs = {
    "user": "hr",
    "password": "hr",
    "connectString": "192.168.56.101/orcl"
}

// HTTP Method: GET
// URI        : /employees
app.get('/employees', function (req, res) {
    "use strict";
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to Database",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM EMPLOYEES", {}, {
            outFormat: oracledb.OBJECT
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the employees",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
            }

            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /employees : Connection released");
                    }
                });
        });
    });
});

var server = app.listen(3000, function () {
    "use strict";
    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});
