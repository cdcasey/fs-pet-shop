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
                return res.sendStatus(500);
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

app.use(function (require, response) {
    response.statusCode = 404;
    response.send('Not Found');
});

app.listen(port, function () {
    console.log('Listening on port', port);
});