'use strict';

const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8000;

app.disable('x-powered-by');

app.route('/pets')
    .get((request, response) => {
        const { headers, method, url } = request;
        fs.readFile('./pets.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err.stack);
                return response.sendStatus(500);
            }
            let pets = JSON.parse(data);

            response.setHeader('Content-Type', 'application/json');
            response.send(pets);
        })


    })

app.route('/pets/:id')
    .get((request, response) => {
        const { headers, method, url } = request;
        fs.readFile('./pets.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err.stack);
                return res.sendStatus(500);
            }
            let pets = JSON.parse(data);
            let petId = Number(request.params.id);
            if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
                return response.sendStatus(404);
            }

            response.set('Content-Type', 'application/json');
            response.send(pets[petId]);
        })
    })

app.route('/pets')
    .post((request, response) => {
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
                    let pets = JSON.parse(data);
                    pets.push(newPet);
                    let myData = JSON.stringify(pets);
                    fs.writeFile('./pets.json', myData, (err) => {
                        if (err) {
                            throw err;
                        } else {
                            response.set('Content-Type', 'application/json');
                            message = JSON.stringify(newPet);
                            response.send(message);
                        }
                    })
                })
            }
        })
    })

app.use(function (request, response) {
    response.status(404).send('Not Found');
});

app.listen(port, function () {
    console.log('Listening on port', port);
});