var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/web-hooks', secret: 'l34ktk2k2323' })
// 上面的 secret 保持和 GitHub 后台设置的一致

var env = require('./env')

function run_cmd(cmd, args, callback) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
    child.stdout.on('end', function() { callback (resp) });
}

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(7777)

handler.on('error', function (err) {
    console.error('Error:', err.message)
})

handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);
    var rep_name = event.payload.repository.name;
    var ref = event.payload.ref;
    if(rep_name == env.repository_name){
        if(ref == env.ref){
            run_cmd('sh', ['./share.sh'], function(text){ console.log(text) });
        }
    }
})