import app from "../configuracao/app.js"
import { trataSobSessao } from "./sessao.js"

export function userDataService(){
    app.get("/user-data/", (request, response)=>{
        trataSobSessao(request, response, 
            (request, response)=>{
            response.status(404);
            response.json({error: "nenhum cookie encontrado"})
        }, (request, response)=>{
            response.status(403);
            response.json({error: "cookie invalido"})
        }, (request, response, user_data)=>{
            console.log(user_data);
            response.status(200)
            response.json(user_data)
        });
    })
}