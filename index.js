//PAQUETES NECESARIOS
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

//IMPORTAR NUESTRA RUTAS
const productos = require('./routes/productos')
const lugares = require('./routes/lugares')


//________________________________________________VARIABLES_____________________________________________________

const app = express();
const uri=`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.busc9.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const corsOptions={
    origin: "*",
    optionsSuccessStatus: 200
}
//__________________________________________________________________________________________________________________

//Funciones del Middleware
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors(corsOptions))

//Contenido de nuestras Rutas
app.use('/api/productos', productos);
app.use('/api/lugares', lugares);

//__________________________CONEXIONES_______________________________________

//Conexion a algun puerto y la impresion de este puerto.                     //
const port = process.env.PORT || 3000;                                       //
                                                                             //       
app.listen(port, () => {                                                     
    console.log(`API REST OK y escuchando en el puerto ${port}....`);
});

//Nos conectamos al servidor de mongo, y en seguida mostramos
//si nos pudimos conectar o se detecto algun error.

mongoose.connect(uri, options)
    .then( ()=> console.log('Conexion Satisfactoria:))))'))
    .catch( (e)=> console.log('Error' + e))

//__________________________FIN DE APP.JS________________________________

