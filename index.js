const express = require("express");
const conectarDB = require('./config/db');
const cors = require('cors');


const app = express();
// conectamos

conectarDB();
app.use(cors())


app.use(express.json());
app.use('/viamatica', require('./routes/usermanage'));


app.listen(3000, () => console.log("Server is running"));

