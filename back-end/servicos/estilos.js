import app from "../configuracao/app.js"

export function usarServicoEstilos(){
    app.get("/estilo/:filename", (request, response)=>{
        const filename = request.params.filename;
        console.log(filename.match(/\.\./));
        if(!filename.match(/\.\./)) {
            response.status(202)
            response.sendFile(`/home/marcelotesai/Documents/procto final de web 2022/front-end/styleGeral.css/${filename}`);
        } else {
            response.status(403);
            response.json({error: "rotas relativas nao sao permitidas"})
        }
    })
}