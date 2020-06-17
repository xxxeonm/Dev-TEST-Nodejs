const fs = require('fs');
fs.readFile('sample.txt', function(err, data) {
    if (err) throw err;
    console.log(data);
})
// fs.readFile('sample.txt', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })