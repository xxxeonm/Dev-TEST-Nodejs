var http = require('http'); //node의 http모듈을 가져옴, http: http 통신할 때 사용
var fs = require('fs'); //node의 fs모듈을 가져옴, fs: file system에 접근할 때 사용
var app = http.createServer(function(request,response){ //서버 생성
    var url = request.url; //클라이언트가 요청한 URL을 받아옴
    if (request.url == '/'){ //클라이언트가 요청한 URL이 root이면,
        response.end("Success"); //index.html을 화면에 보여줌
    }
    response.writeHead(200); //status code == 200을 보내줌
    response.end(fs.readFileSync(__dirname + url)); //화면에 디렉토리+URL 보여줌
});
app.listen(3000); //생성한 서버는 3000번 포트에 listen