var http = require('http'); 
var fs = require('fs'); //node의 fs모듈을 가져옴, fs: file system에 접근할 때 사용
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url; //사용자가 request한 url
    if (_url === '/'){ 
        response.writeHead(200); 
        response.end("Success"); 
    } else {
        response.writeHead(404); 
        response.end("Not Found");
    }
});
app.listen(3000); 