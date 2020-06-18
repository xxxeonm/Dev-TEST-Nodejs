var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); //node의 querystring 모듈을 가져옴

function templateHTML(title, list, body) {
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
        <a href="/create">create </a>
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

var app = http.createServer(function(request, response){ //request: 사용자가 요청한 정보, response: 서버가 응답한 정보
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
                title = queryData.id;
                description = fs.readFileSync(`data/${queryData.id}`, 'utf8')
            }
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template);
        });
    } else if(pathname ==='/create') { //입력 폼 출력
        fs.readdir('./data', function (error, files) {
            var title;
            var list = templateList(files);
            var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `);
            response.writeHead(200);
            response.end(template);
        });
    } else if(pathname === '/create_process') { //제출 버튼 클릭 시, post 방식으로 네트워킹
        var body ='';
        
        request.on('data', function(data) { //데이터가 너무 많을 때를 대비하여 데이터 조각들을 수신할 때마다 콜백함수를 호출함, data라는 인자를 통해 수신한 정보를 줌
            body += data; //body변수에 data 추가
        });
        request.on('end', function() { //더이상 들어올 데이터가 없을 때 콜백 실행
            var post = qs.parse(body); 
            console.log(post);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${title}`}); //리다이렉션
                response.end();
            });
            console.log(post.title);
        });
    } else {
        response.writeHead(404);
        response.end("Not Found")
    }

});
app.listen(3000);