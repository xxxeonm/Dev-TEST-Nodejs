var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); 

function templateHTML(title, list, body, control) {
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
        ${control}
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

var app = http.createServer(function(request, response){ 
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/' ) {
        fs.readdir('./data', function (error, files) {
            var title;
            var description;
            var list = templateList(files);
            var template;
            if (queryData.id === undefined) {
                title = 'Welcome';
                description = 'Hello, Node.js';
                template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href='/create'>create</a>`);
            } else {
                title = queryData.id;
                description = fs.readFileSync(`data/${queryData.id}`, 'utf8')
                template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `
                    <a href='/create'>create</a> 
                    <a href='/update?id=${title}'>update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>`);
            }
            response.writeHead(200);
            response.end(template);
        });
    } else if(pathname ==='/create') { //입력 폼 출력
        fs.readdir('./data', function (error, files) {
            var title;
            var list = templateList(files);
            var template = templateHTML(title, list, `
            <form action="/create_process" method="post">
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
    } else if(pathname === '/create_process') { 
        var body ='';
        
        request.on('data', function(data) { 
            body += data; 
        });
        request.on('end', function() { 
            var post = qs.parse(body); 
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) { 
                response.end();
            });
        });
    } else if (pathname === '/update') { //수정폼 출력
        fs.readdir('./data', function(error, filelist){
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
              var title = queryData.id;
              var list = templateList(filelist);
              var template = templateHTML(title, list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                `
                <a href="/create">create</a> 
                <a href="/update?id=${title}">update</a>`
              );//삭제버튼 추가
              response.writeHead(200);
              response.end(template);
            });
          });
    } else if(pathname === '/update_process') {
        var body ='';
        
        request.on('data', function(data) { 
            body += data; 
        });
        request.on('end', function() { 
            var post = qs.parse(body); //post로 form객체 내용 파싱
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function(data) {
            var post = qs.parse(body);
            console.log(post);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
          });
    } else {
        response.writeHead(404);
        response.end("Not Found")
    }

});
app.listen(3000);