import { request, response } from "express"
import app from "../configuracao/app.js"

export function usarMedia(){
    app.get("/media/photos/:filename" ,(request,response)=>{
        const filename = request.params.filename;
        console.log(filename.match(/\.\./));
        if(!filename.match(/\.\./)){
            response.status(202)
            response.sendFile(`/home/marcelotesai/Documents/PRW/projectoFinal/imag/${filename}`);
        }else {response.status(403);
            response.json({error:"rotas relativas nao sao primeiras"})
        }
})

}