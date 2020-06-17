// 49-53: fs.readFile[Async] + callback ?????

var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHtml(title, list, body) {
    return  `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
    </body>
    </html>
    `;
}

function templateList(files) {
    var list = '<ul>';
    var i = 0;
    while (i < files.length) {
        list += `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
        i++;
    }
    list += '</ul>';
    return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/' ) {
        fs.readdir('./data', function (error, files) {
            var title;
            var description;
            var list = templateList(files);
            if (queryData.id === undefined) {
                title = 'Welcome';
                description = 'Hello, Node.js';
            } else {
                fs.readFile(`data/${queryData.id}`, 'utf8', function(error, content) {
                    title = queryData.id;
                    description = content;
                    console.log("01 title:", title, "des: ", description);
                });
                console.log("02 title:", title, "des: ", description);
            }
            console.log("03 title:", title, "des: ", description);
            var template = templateHtml(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template);
        });
    } else {
        response.writeHead(404);
        response.end("Not Found")
    }

});
app.listen(3000);