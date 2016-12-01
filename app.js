#!/usr/bin/env node

const passportSocketIo = require("passport.socketio");
const http = require('http');
const log   = require('debug')('notes:server');
const error = require('debug')('notes:error');

const sessionCookie = 'notes.sid';
const sessionSecret = 'keyboard mouse';
const sessionStore  = new FileStore({ path: "sessions" });

var app = express();

var server = http.createServer(app);
var io = require('socket.io')(server);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:          sessionCookie,
    secret:       sessionSecret,
    store:        sessionStore
}));

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.use(session({
    store: sessionStore,
    secret: sessionSecret,
    key: sessionCookie,
    resave: true,
    saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users.router);
app.use('/notes', notes);

routes.socketio(io);
// notes.socketio(io);

module.exports = app;

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    log('Listening on ' + bind);
}