const http = require('http');
const fs = require('fs');
// const crud = require('./pets');


const crud = {
    GET: function (args = null, request, response) {
        fs.readFile('./pets.json', (err, data) => {
            let pets = JSON.parse(data);
            if (args[0] !== undefined && args[0]) {
                if (pets[args[0]]) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(pets[args[0]]));
                } else {
                    response.statusCode = 404;
                    response.setHeader('Content-Type', 'text/plain');
                    const message = "Not found";
                    response.write(message);
                }
            } else {
                response.setHeader('Content-Type', 'application/json');
                response.write(data);
            }
            response.end();
        })
    },
    POST: function (args = null, request, response) {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            let newPet = JSON.parse(Buffer.concat(body).toString());
            console.log(newPet.name);

            if (!newPet.name && !newPet.age && !newPet.kind) {
                response.statusCode = 400;
                response.setHeader('Content-Type', 'text/plain');
                const message = "New pet must have name, age, & kind attributes.";
                response.write(message);
                response.end();
            } else {
                fs.readFile('./pets.json', (err, data) => {
                    let pets = JSON.parse(data);
                    pets.push(newPet);
                    let myData = JSON.stringify(pets);
                    fs.writeFile('./pets.json', myData, (err) => {
                        if (err) {
                            throw err;
                        } else {
                            response.setHeader('Content-Type', 'application/json');
                            response.write(JSON.stringify(newPet));
                            response.end();
                        }
                    })
                })

            }
        })
    }
}

const server = http.createServer((request, response) => {
    const { headers, method, url } = request;
    const command = url.split('/');
    if (url.startsWith('/pets') && crud[method]) {
        crud[method](command.slice(2), request, response);
    } else {
        const message = `Endpoint not found`;
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.write(message);
        response.end();
    }
}).listen(5000);

/*
const server = http.createServer();
server.on('request', (request, response) => {
    // the same kind of magic happens here!
    console.log("body?", request.body);
    const { headers, method, url } = request;
    console.log(method, url);

    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
        console.log("BODY", body);

    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("BODY DATDA", body);
    })

    // let message = { hello: 'world' };
    let message = crud.read();
    console.log("MESSAGE", message);

    // response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(message));
    // return 'hello';
});
server.listen(5000);
*/

module.exports = server;