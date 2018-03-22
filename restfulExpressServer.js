'use strict';

const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8000;

app.disable('x-powered-by');

app.route('/pets')
    .get((request, response, next) => {
        const { headers, method, url } = request;
        fs.readFile('./pets.json', 'utf8', (err, data) => {
            if (err) {
                next(err);
            } else {
                let pets = JSON.parse(data);
                response.setHeader('Content-Type', 'application/json');
                response.send(pets);
            }
        })
    })
    .post((request, response, next) => {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        }).on('end', () => {
            let message;
            const newPet = JSON.parse(body);
            if (!newPet.name || !newPet.age || !newPet.kind) {
                message = "New pet must have name, age, & kind attributes.";
                response.statusCode = 400;
                response.set('Content-Type', 'text/plain');
                response.send(message);
            } else {
                fs.readFile('./pets.json', (err, data) => {
                    if (err) {
                        next(err);
                    } else {
                        let pets = JSON.parse(data);
                        pets.push(newPet);
                        let myData = JSON.stringify(pets);
                        fs.writeFile('./pets.json', myData, (err) => {
                            if (err) {
                                next(err);
                            } else {
                                response.set('Content-Type', 'application/json');
                                message = JSON.stringify(newPet);
                                response.send(message);
                            }
                        })
                    }
                })
            }
        })
    })

app.route('/pets/:id')
    .get((request, response, next) => {
        const { headers, method, url } = request;
        fs.readFile('./pets.json', 'utf8', (err, data) => {
            if (err) {
                next(err);
            } else {
                let pets = JSON.parse(data);
                let petId = Number(request.params.id);
                if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
                    return response.sendStatus(404);
                }

                response.set('Content-Type', 'application/json');
                response.send(pets[petId]);
            }
        })
    })


app.use(function (request, response) {
    response.status(404).send('Not Found');
});

app.use(function (err, request, response, next) {
    console.error(err.stack)
    response.status(500).send("Something broke! We'll fix it soon");
})

app.listen(port, function () {
    console.log('Listening on port', port);
});

module.exports = app;