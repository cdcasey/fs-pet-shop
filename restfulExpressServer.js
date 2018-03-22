'use strict';

const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8000;
const petsFile = './pets.json';

require('locus');

app.disable('x-powered-by');

app.use(morgan('combined'));

app.use(bodyParser.json());

app.route('/pets')
    .get((request, response, next) => {
        const { headers, method, url } = request;
        fs.readFile(petsFile, 'utf8', (err, data) => {
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
        let message;
        const newPet = request.body;
        if (!newPet.name || !newPet.age || !newPet.kind) {
            message = "New pet must have name, age, & kind attributes.";
            response.statusCode = 400;
            response.set('Content-Type', 'text/plain');
            response.send(message);
        } else {
            fs.readFile(petsFile, (err, data) => {
                if (err) {
                    next(err);
                } else {
                    let pets = JSON.parse(data);
                    pets.push(newPet);
                    writeData(petsFile, pets, newPet, response);
                }
            })
        }
    })

app.route('/pets/:id')
    .get((request, response, next) => {
        const { headers, method, url } = request;
        fs.readFile(petsFile, 'utf8', (err, data) => {
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
    .delete((request, response, next) => {
        const { headers, method, url } = request;
        fs.readFile(petsFile, 'utf8', (err, data) => {
            if (err) {
                next(err);
            } else {
                let pets = JSON.parse(data);
                let petId = Number(request.params.id);
                if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
                    return response.sendStatus(404);
                }
                const deletedPet = pets.splice(petId, 1);
                writeData(petsFile, pets, deletedPet, response);
            }
        })

    })
    .patch((request, response, next) => {
        const { headers, method, url } = request;
        const petInfo = request.body;
        console.log(petInfo);
        if (!petInfo.name || !petInfo.age || !petInfo.kind || isNaN(petInfo.age)) {
            message = "New pet must have name, age, & kind attributes. Age must be a number.";
            response.statusCode = 400;
            response.set('Content-Type', 'text/plain');
            response.send(message);
        } else {
            fs.readFile(petsFile, (err, data) => {
                if (err) {
                    next(err);
                } else {
                    let pets = JSON.parse(data);
                    let petId = Number(request.params.id);
                    if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
                        return response.sendStatus(404);
                    }
                    let currentPet = pets[petId];
                    currentPet.age = Number(petInfo.age);
                    currentPet.kind = petInfo.kind;
                    currentPet.name = petInfo.name;
                    writeData(petsFile, pets, currentPet, response);
                }
            })
        }
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

function writeData(file, data, responseData, response) {
    fs.writeFile(file, JSON.stringify(data), (err) => {
        if (err) {
            next(err);
        } else {
            response.set('Content-Type', 'application/json');
            response.send(responseData);
        }
    })
}

module.exports = app;