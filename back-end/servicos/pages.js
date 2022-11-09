import app from "../configuracao/app.js"

export function redirect(request,response, url){
    response.status(308);
    response.send(`<meta http-equiv="refresh" content="0;url=${url}">`);
}

export function usarServicoPaginas(){
    app.get("/", (request, response)=>{
        response.sendFile(`/home/marcelotesai/Documents/procto final de web 2022/front-end/paginais/pagina-inicial.html`);
    })

    app.get("/pages/:filename", (request, response)=>{
        const filename = request.params.filename;
        console.log(filename.match(/\.\./));
        if(!filename.match(/\.\./)) {
            response.status(202)
            response.sendFile(`/home/marcelotesai/Documents/procto final de web 2022/front-end/paginais/${filename}`);
        } else {
            response.status(403);
            response.json({error: "rotas relativas nao sao permitidas"})
        }
    })
}