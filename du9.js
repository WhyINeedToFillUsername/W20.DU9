const http = require("http");

http.createServer(function (req, res) {
    // log request object
    console.log("\nIncoming request: " + req.method + " " + req.url);

    // initialize the body to get the data asynchronously
    req.body = "";

    // get the data of the body
    req.on('data', function (chunk) {
        req.body += chunk;
        console.log("adding data");
    });

    // all data have been received
    req.on('end', function () {
        if (req.method === "GET" && req.url.match("^/events")) {
            processGetRequest(req, res);
        } else {
            console.log("bad request");
            res.writeHead(400);
            res.end('bad request');
        }
    });

    // main function to process a GET request
    function processGetRequest(req, res) {
        console.log("incoming get request, serving...");
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:63342',
            'Content-Type': 'text/event-stream',
            'cache-control': "no-cache"
        });
        let currTime = new Date().getTime();

        // 'loop' using recursion (cannot use while loop with sleep in node.js)
        sendEvent(res, currTime);
    }
}).listen(8080);

function sendEvent(res, currTime) {
    // if (new Date().getTime() - currTime < 20000) { // limit for 20s, unnecessary
        let runTime = (new Date().getTime() - currTime) / 1000;
        console.log('writing to res: ' + runTime);
        res.write("data: connected for " + runTime + " seconds.\n\n");

        setTimeout(function () { // "sleep" for 4 s
            sendEvent(res, currTime);
        }, 4000);
    // } else {
    //     res.end();
    // }
}
