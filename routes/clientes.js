const express = require('express');
const Joi = require('joi');
const ruta = express.Router();
const Cliente = require('../models/clientemodel');
const mail = require('../config/mailer');
const tokenDef = [];

const trans = mail.transporter;
//-----------------------------------------------
//-----------------Validación--------------------
//-----------------------------------------------

const schema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net']
            }
        }),

    tel: Joi.number()
        .min(1000000000)
        .required(),

});

//-----------------------------------------------
//--------------------Rutas----------------------
//-----------------------------------------------

// Obtener lista de Clientes
ruta.get('/', (req, res) => {
    let resultado = VisualizarClientes();
    resultado
        .then(clientes => {
            res.json(clientes);
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

// Crear un cliente nuevo
ruta.post('/', (req, res) => {

    let body = req.body; 

    const { error, value } = schema.validate({
        email: body.email,
        tel: body.tel
    });

    if (!error) {
        let resultado = crearCliente(req.body); 
        resultado 
            .then(cliente => { 
                if (tokenDef.length)
                    tokenDef.pop()
                tokenDef.push(atob(cliente.token))
                enviarEmail(cliente.email, tokenDef[0])
                res.json({
                    valor: cliente
                });
                
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({
                    error: err
                });
            });
    } 
    else {
        res.status(400).json({
            error: error.message
        })
    }
});


//------------------------------------------------------------------
//--------------------- Funciones ----------------------------------
//------------------------------------------------------------------

async function VisualizarClientes() {
    let clientes = await Cliente.find();
    return clientes;
}

async function crearCliente(body) {
    const token_code = makeid(6);
    console.log("Token Codificado: ", token_code);
    console.log("Token Descodificado: ", atob(token_code));
    let cliente = new Cliente({
        email: body.email,
        instagram: body.instagram,
        tel: body.tel,
        token: token_code
    });

    return await cliente.save()
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("Sin codificar: ", result)
    const resultC = btoa(result);

    return resultC;
}

async function enviarEmail(email, token) {

    try{
        let info = await trans.sendMail({
            from: '"Bazar en Linea" <bazarenlinea13@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Soy tu token", // Subject line
            template: 'token',
            context: {
                token: token
            }
          });
          console.log(`Correo Enviado a : ${email} ` );
    } catch (error){
        console.log('No se pudo envia correo. Algo salio mal', error)
    }
}


module.exports = {ruta, tokenDef};