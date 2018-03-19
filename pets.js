#!/usr/bin/env node

const fs = require('fs');

let crud = {
    create: function (args = null) {
        if (args[2] === undefined) {
            console.error(`Usage: node pets.js create AGE KIND NAME`);
            process.exit(1);
        }
        fs.readFile('./pets.json', (err, data) => {
            let pets = JSON.parse(data);
            var newPet = { age: Number(args[0]), kind: args[1], name: args[2] };
            pets.push(newPet);
            let myData = JSON.stringify(pets);
            fs.writeFile('./pets.json', myData, (err) => {
                console.log(newPet);
                if (err) {
                    throw err;
                }
            })
        })
    },
    read: function (args = null) {
        fs.readFile('./pets.json', (err, data) => {
            let pets = JSON.parse(data);
            if (args[0]) {
                console.log(pets[args[0]]);
            } else {
                console.log(pets);
            }
        })
    },
    update: function (args = null) {
        if (args[3] === undefined) {
            console.error(`Usage: node pets.js update INDEX AGE KIND NAME`);
            process.exit(1);
        }
        fs.readFile('./pets.json', (err, data) => {
            let pets = JSON.parse(data);
            let currentPet = pets[args[0]];
            currentPet.age = Number(args[1]);
            currentPet.kind = args[2];
            currentPet.name = args[3];
            let myData = JSON.stringify(pets);
            fs.writeFile('./pets.json', myData, (err) => {
                console.log(currentPet);
                if (err) {
                    throw err;
                }
            })
        })
    },
    destroy: function (args = null) {
        if (args[0] === undefined) {
            console.error(`Usage: node pets.js destroy INDEX`);
            process.exit(1);
        }
        fs.readFile('./pets.json', (err, data) => {
            let pets = JSON.parse(data);
            console.log(pets[args[0]]);
            pets.splice(args[0], 1);
            let myData = JSON.stringify(pets);
            fs.writeFile('./pets.json', myData, (err) => {
                if (err) {
                    throw err;
                }
            })
        })
    }
}

let command = process.argv.slice(2);

if (command[0] && crud[command[0]]) {
    crud[command[0]](command.slice(1));
} else {
    console.error(`Usage: node pets.js [read | create | update | destroy]`);
    process.exit(1);
}