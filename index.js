const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const solc = require('solc');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  
app.post('/', (req, res) => {
    console.log(req.body)
    fs.unlinkSync('./contracts/Contract.sol', (e) => {
        console.log(e)
    })
    fs.writeFileSync('./contracts/Contract.sol', req.body.code, 'utf-8')
    var spawn = require('child_process').spawn;
    var compile = spawn('node', ['compile.js']);
    compile.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    compile.stderr.on('data', function (data) {
        console.log(String(data));
    });
    compile.on('close', function (data) {
        if (data === 0) {
            var run = spawn('node', ['compile.js']);
            run.stdout.on('data', function (output) {
                console.log(String(output));
            });
            run.stderr.on('data', function (output) {
                console.log(String(output));
            });
            run.on('close', function (output) {
                console.log('stdout: ' + output);
            })
        }
    })
    
})

app.listen(4000, (err) => {
    if (err) console.log(err);
    console.log('server listening to port 4000')
})