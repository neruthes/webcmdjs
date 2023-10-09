const http = require('http');
const webcmd = require('../src/webcmd.js').createApp();



webcmd.define('hello', function (data) {
    data.res.writeHead(200);
    data.res.end(`Hello, user ${data.env.uid} (token=${data.env.token})\n`);
});
webcmd.define('echo', function (data) {
    data.res.writeHead(200);
    data.res.write(`Hello, user ${data.env.uid} (token=${data.env.token})\n`);
    data.res.write(`Your text input is:\n`);
    data.res.end(data.args.text);
});




const myAuthenticator = function (token) {
    const tokenTable = {
        '1145141919810': '114514'
    };
    const uid = tokenTable[token];
    if (uid === undefined) {
        throw (new Exception('Invalid token: ' + token));
    };
    return {
        uid, token
    };
};
http.createServer(function (req, res) {
    console.log('new request');
    let reqbody = '';
    req.on('data', function (chunk) {
        reqbody += chunk;
    });
    req.on('end', function () {
        console.log('=======reqbody=======');
        console.log(reqbody);
        if (req.url === '/api/webcmd') {
            // Authenticate token and define env
            // console.log(req.headers);
            let env;
            try {
                env = myAuthenticator(req.headers.token);
            } catch (e) {
                res.writeHead(403);
                res.end(JSON.stringify({ err: 403, errmsg: 'Authentication failed.'}));
                return 1;
            };
            try {
                env.reqbody = reqbody;
                webcmd.accept(req, res, env);
            } catch (e) {
                res.writeHead(403);
                console.log(e);
                res.end(JSON.stringify({ err: 500, errmsg: 'Other problem.'}));
                return 1;
            }
        };
        console.log(req.url);
    });
}).listen(12349);



/* ========================================= //
Test commands:
curl -X POST --data \
    '{"cmd": "echo", "args": {"text": "Loerm ipsum dolor sit amet"}}' \
    -H 'token: 1145141919810' \
    'http://localhost:12349/api/webcmd'
// ========================================= */
