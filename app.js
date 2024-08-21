const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const db = require("./config/mongoose-connection");
const cors = require('cors')

const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}));

const indexRouter = require('./routes/index-route');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use('/',indexRouter);

app.listen(process.env.PORT || 3000);
