import express, { response } from "express"
import mysql from "mysql"
import bodyParser from "body-parser"
import multer from "multer"
import cors from "cors"
import { request } from "http"

const app = express()

app.use(express.json())
app.use(multer().array())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let connected = false

app.get("/rotas/imagens/",(request, response)=>{
    response.sendFile("/home/marcelotesai/Documents/PRW/projectoFinal/Back_end/recurso/fotos")
})

app.listen(8080)