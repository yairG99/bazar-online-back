const express = require('express');
const Joi = require('joi');
const ruta = express.Router();
const clientes = require('./clientes');
const jwt = require("jsonwebtoken");
const tokenDef = clientes.tokenDef;

ruta.post("/login", (req, res) => {
    const status = {
        status: 'success'
    }

    jwt.sign({status}, req.body.token, {expiresIn: '120s'}, (err, token) => {
        if (err){
            console.log(err)
        }
        else{
            res.json({
                token
            });
        }
    });

});

ruta.post("/posts", verifyToken, (req, res) => {
    
    jwt.verify(req.token, tokenDef[0], (error, authData) => {
        if (error) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: "Post fue creado",
                authData
            });
        }
    });
});

// Authorization: Bearer <token>
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = ruta;