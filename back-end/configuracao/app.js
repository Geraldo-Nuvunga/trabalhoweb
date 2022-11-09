import express, { request, response } from "express"
import mysql from "mysql"
import cors from "cors"
import bodyParser from "body-parser";
import multer from "multer";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer().array());
app.use(express.json());

export default app;