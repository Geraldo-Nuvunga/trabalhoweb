import express, { request, response } from "express"
import mysql from "mysql"
import cors from "cors"
import bodyParser from "body-parser";
import multer from "multer";

const app = express()


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer().array());
app.use(express.json());

let connected=false

let connection=mysql.createConnection({
    host:"localhost",
    user:"WebSoft",
    password:"websoft",
    database:"Projecto_final",
})

connection.connect((erro)=>{
    if(erro){
        console.log(erro);
    }else{
        connected=true
    }
})
let gatinhos =[]

const obterGatinhos =()=>{
    console.log("Gatinhos:"+gatinhos);
    return gatinhos
}

app.get("/gatinhos/",(request,response)=>{
    if(connected){
        connection.query("select* from gatinho",(error,results,fields)=>{
            if(error){
                console.log(error)
                response.json(error)
            }else {
                let gatinhos =[]
                results.forEach(result => {
                    gatinhos.push({nome:result.nome,idade:result.idade,id:result.id})
                   
                })
                response.json(gatinhos)
            }
        })
    }
})
app.get("/gatinhos/:id",(request,response)=>{
    if(connected){
        connection.query('select* from gatinho',(error,results,fields)=>{
            if(error){
                console.log(error)
                response.json(error)
            } else{
                let gatinhos =[]
                results.forEach(result=>{
                    gatinhos.push({nome:result.nome,idade:result.idade,id:result.id})
                })
                let gatinhosFiltrados=gatinhos.filter(gatinho=>{
                    if(gatinho.id==request.params.id){
                        return gatinho
                    }
                })
                response.json(gatinhosFiltrados)
            }
        })
    
    }
    
})
app.post("/gatinhos/",(request,response)=>{
    let new_gatinho=request.body;
    console.log(new_gatinho);
    if(!connected){
        response.status(500)
        response.json({error:"falha na connect ao sql"});
    }
    else if (new_gatinho.nome!=undefined && new_gatinho.idade!=undefined){
        new_gatinho.nome=new_gatinho.nome.replaceAll(/'|"/g, ':')
        new_gatinho.idade=Number(new_gatinho.idade);
        connection.query(`insert into gatinho(nome,idade)values("${new_gatinho.nome}",${new_gatinho.idade})`)
        response.status(202)
        response.json({message:"gatinho criado criado com sucesso"})
    }else{
        response.status(400)
        response.json({error:"dados incorretos"})
    }
})
app.put("/gatinhos/:id/",(request,response)=>{
    let new_gatinho= request.body
    let id = Number(request.params.id)
    if(!connected){
        response.status(500)
        response.json({error:"Nao conectado ao sql"});
    } else if (new_gatinho.nome!=undefined && new_gatinho.idade !=undefined){
        new_gatinho.nome=new_gatinho.nome.replaceAll(/'|"/g,':')
        new_gatinho.idade=Number(new_gatinho.idade);
        connection.query(`select exists(select*from gatinho where id=${id}) as resultado`,(error,results,fislds)=>{
            if(!error){
                if(results[0].resultado){
                    connection.query(`update gatinho set nome="${new_gatinho.nome}",idade=${new_gatinho.idade} where id=${id};`,(error)=>{
                        if(!error){
                            response.status(200)
                            response.json({message:"gatinho actualizado"})
                        }else {
                            response.status(500)
                            response.json({erro:"error"})
                        }
                    })
                } else {
                    response.status(404)
                    response.json({error:"gatinho nao encontrado"})
                }
            }else{
                response.status(500)
                response.json({error:"error"})
            }
        })
    }else {
        response.status(400)
        response.json({error:"dados incorretos"});
    }
})
app.delete("/gatinhos/:id/",(request,response)=>{
    let id = Number(request.params.id)
    if(!connected){
        response.status(500)
        response.json({error:"Nao conectado ao sql"});
    } else {
       
        connection.query(`select exists(select*from gatinho where id=${id}) as resultado`,(error,results,fislds)=>{
            if(!error){
                if(results[0].resultado){
                    connection.query(`delete from gatinho where id=${id};`,(error)=>{
                        if(!error){
                            response.status(200)
                            response.json({message:"gatinho deletado"})
                        }else {
                            response.status(500)
                            response.json({erro:"error"})
                        }
                    })
                } 
                
            }else{
                response.status(500)
                response.json({error:"error"})
            }
        })
    }

})

//criacao do projecto

let cliente =[]

const obterClientes =()=>{
    console.log("clientes:"+clientes);
    return cliente
}

app.post("/clientes/",(request,response)=>{
    let new_cliente=request.body
    console.log(new_cliente);
    if(!connected){
        response.status(500)
        response.json({error:"Falha na conexao de sql"});
    }
    else if(new_cliente.nome!=undefined && new_cliente.email!=undefined && new_cliente.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/)&& new_cliente.palavra_passe!=undefined && new_cliente.numero!=undefined){
        new_cliente.nome=new_cliente.nome.replaceAll(/'|"/g,':')
        new_cliente.numero=Number(new_cliente.numero);
        connection.query(`insert into cliente(nome,email,palavra_passe,numero) values("${new_cliente.nome}","${new_cliente.email}","${new_cliente.palavra_passe}",${new_cliente.numero})`)
        response.status(202)
        response.json({message:"Cliente criado com sucesso"})
    
    }else{
        response.status(400)
        response.json({error:"dados incorretos"})
    }
})
app.get("/clientes/",(request,response)=>{
    if(connected){
        connection.query("select * from cliente",(error,results,fields)=>{
            if(error){
                console.log(error)
                response.json(error)
            }else {
                let clientes=[]
                results.forEach(result=>
                    {
                        clientes.push({nome:result.nome,email:result.email,palavra_passe:result.palavra_passe,numero:result.numero})
                    })
                    response.json(clientes)
            }
        })
    }
})
app.get("/clientes/:id/",(request,response)=>{
    if(connected){
        connection.query("select * from cliente", (error,results,fields)=>{
            if(error){
                console.log(error)
                response.json(error)
            } else {
                let clientes=[]
                results.forEach(result=>{
                    clientes.push({nome:result.nome, email:result.email, palavra_passe:result.palavra_passe, numero:result.numero,id:result.id})
                })
                let clientesFiltrados= clientes.filter(cliente =>{
                    if(cliente.id ==request.params.id){
                        return cliente
                    }
                })

                 response.json(clientesFiltrados)   
            }
        })
    }
})
app.post("/logn_in/",(request,response)=>{
    let entrar=request.body;
    console.log(entrar);
    if(!connected){
        response.status(500)
        response.json({error:"falha na conexao ao sql "});

    }
    else if(entrar.email!=undefined && entrar.palavra_passe!=undefined){
        if(entrar.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/)){
        connection.query(`select exists(select * from cliente where email="${entrar.email}" and palavra_passe="${entrar.palavra_passe}") as valor`,(error,results,fields)=>{
                if(error){
                    console.log(error)
                    response.json(error)
                } else{
                    if(results[0].valor){
                        // encontrado
                        response.json({message:"efectuado com sucesso"});
                    } else {
                        // nao encontrado
                        response.json({message:"nao e possivel"})
                    }
                }
                
            })
        }
        
    }
})

app.get("/rotas/imagens/",(request, response)=>{
    if(connected){
        response.sendFile("/home/marcelotesai/Documents/PRW/projectoFinal/Back_end/recurso/fotos/dafss.jpg")
        // response.sendFile("/home/marcelotesai/Documents/PRW/projectoFinal/Back_end/recurso/fotos/dhgsd.jpg")
        // response.sendFile("/home/marcelotesai/Documents/PRW/projectoFinal/Back_end/recurso/fotos/fssds.jpg")
    }
})

app.get("/imagens/:nome",(request, response)=>{
    if(connected){
        response.sendFile("/home/marcelotesai/Documents/PRW/projectoFinal/Back_end/recurso/fotos",(error,request,fields)=>{
            if(error){
                console.log(error)
                response.json(error)
            }else {
                let fotos= []
                results.forEach(result=>{
                    fotos.push({nome:fotos.nome})
                })
                let fotosFiltrados = fotos.filter(foto=>{
                    if(foto.nome= request.params.nome){
                        return foto
                    }
                })
                response.json(fotosFiltrados)
            }
        })
    }
})



// const app = express()


// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(multer().array());
// app.use(express.json());

// let connected=false

// let connection=mysql.createConnection({
//     host:"localhost",
//     user:"WebSoft",
//     password:"websoft",
//     database:"Projecto_final",
// })

// connection.connect((erro)=>{
//     if(erro){
//         console.log(erro);
//     }else{
//         connected=true
//     }
// })
// let gatinhos =[]

// const obterGatinhos =()=>{
//     console.log("Gatinhos:"+gatinhos);
//     return gatinhos
// }

// app.get("/gatinhos/",(request,response)=>{
//     if(connected){
//         connection.query("select* from gatinho",(error,results,fields)=>{
//             if(error){
//                 console.log(error)
//                 response.json(error)
//             }else {
//                 let gatinhos =[]
//                 results.forEach(result => {
//                     gatinhos.push({nome:result.nome,idade:result.idade,id:result.id})
                   
//                 })
//                 response.json(gatinhos)
//             }
//         })
//     }
// })
// app.get("/gatinhos/:id",(request,response)=>{
//     if(connected){
//         connection.query('select* from gatinho',(error,results,fields)=>{
//             if(error){
//                 console.log(error)
//                 response.json(error)
//             } else{
//                 let gatinhos =[]
//                 results.forEach(result=>{
//                     gatinhos.push({nome:result.nome,idade:result.idade,id:result.id})
//                 })
//                 let gatinhosFiltrados=gatinhos.filter(gatinho=>{
//                     if(gatinho.id==request.params.id){
//                         return gatinho
//                     }
//                 })
//                 response.json(gatinhosFiltrados)
//             }
//         })
    
//     }
    
// })
// app.post("/gatinhos/",(request,response)=>{
//     let new_gatinho=request.body;
//     console.log(new_gatinho);
//     if(!connected){
//         response.status(500)
//         response.json({error:"falha na connect ao sql"});
//     }
//     else if (new_gatinho.nome!=undefined && new_gatinho.idade!=undefined){
//         new_gatinho.nome=new_gatinho.nome.replaceAll(/'|"/g, ':')
//         new_gatinho.idade=Number(new_gatinho.idade);
//         connection.query(`insert into gatinho(nome,idade)values("${new_gatinho.nome}",${new_gatinho.idade})`)
//         response.status(202)
//         response.json({message:"gatinho criado criado com sucesso"})
//     }else{
//         response.status(400)
//         response.json({error:"dados incorretos"})
//     }
// })
// app.put("/gatinhos/:id/",(request,response)=>{
//     let new_gatinho= request.body
//     let id = Number(request.params.id)
//     if(!connected){
//         response.status(500)
//         response.json({error:"Nao conectado ao sql"});
//     } else if (new_gatinho.nome!=undefined && new_gatinho.idade !=undefined){
//         new_gatinho.nome=new_gatinho.nome.replaceAll(/'|"/g,':')
//         new_gatinho.idade=Number(new_gatinho.idade);
//         connection.query(`select exists(select*from gatinho where id=${id}) as resultado`,(error,results,fislds)=>{
//             if(!error){
//                 if(results[0].resultado){
//                     connection.query(`update gatinho set nome="${new_gatinho.nome}",idade=${new_gatinho.idade} where id=${id};`,(error)=>{
//                         if(!error){
//                             response.status(200)
//                             response.json({message:"gatinho actualizado"})
//                         }else {
//                             response.status(500)
//                             response.json({erro:"error"})
//                         }
//                     })
//                 } else {
//                     response.status(404)
//                     response.json({error:"gatinho nao encontrado"})
//                 }
//             }else{
//                 response.status(500)
//                 response.json({error:"error"})
//             }
//         })
//     }else {
//         response.status(400)
//         response.json({error:"dados incorretos"});
//     }
// })
// app.delete("/gatinhos/:id/",(request,response)=>{
//     let id = Number(request.params.id)
//     if(!connected){
//         response.status(500)
//         response.json({error:"Nao conectado ao sql"});
//     } else {
       
//         connection.query(`select exists(select*from gatinho where id=${id}) as resultado`,(error,results,fislds)=>{
//             if(!error){
//                 if(results[0].resultado){
//                     connection.query(`delete from gatinho where id=${id};`,(error)=>{
//                         if(!error){
//                             response.status(200)
//                             response.json({message:"gatinho deletado"})
//                         }else {
//                             response.status(500)
//                             response.json({erro:"error"})
//                         }
//                     })
//                 } 
                
//             }else{
//                 response.status(500)
//                 response.json({error:"error"})
//             }
//         })
//     }

// })

// //criacao do projecto

// let cliente =[]

// const obterClientes =()=>{
//     console.log("clientes:"+clientes);
//     return cliente
// }

// app.post("/clientes/",(request,response)=>{
//     let new_cliente=request.body
//     console.log(new_cliente);
//     if(!connected){
//         response.status(500)
//         response.json({error:"Falha na conexao de sql"});
//     }
//     else if(new_cliente.nome!=undefined && new_cliente.email!=undefined && new_cliente.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/)&& new_cliente.palavra_passe!=undefined && new_cliente.numero!=undefined){
//         new_cliente.nome=new_cliente.nome.replaceAll(/'|"/g,':')
//         new_cliente.numero=Number(new_cliente.numero);
//         connection.query(`insert into cliente(nome,email,palavra_passe,numero) values("${new_cliente.nome}","${new_cliente.email}","${new_cliente.palavra_passe}",${new_cliente.numero})`)
//         response.status(202)
//         response.json({message:"Cliente criado com sucesso"})
    
//     }else{
//         response.status(400)
//         response.json({error:"dados incorretos"})
//     }
// })
// app.get("/clientes/",(request,response)=>{
//     if(connected){
//         connection.query("select * from cliente",(error,results,fields)=>{
//             if(error){
//                 console.log(error)
//                 response.json(error)
//             }else {
//                 let clientes=[]
//                 results.forEach(result=>
//                     {
//                         clientes.push({nome:result.nome,email:result.email,palavra_passe:result.palavra_passe,numero:result.numero})
//                     })
//                     response.json(clientes)
//             }
//         })
//     }
// })
// app.get("/clientes/:id/",(request,response)=>{
//     if(connected){
//         connection.query("select * from cliente", (error,results,fields)=>{
//             if(error){
//                 console.log(error)
//                 response.json(error)
//             } else {
//                 let clientes=[]
//                 results.forEach(result=>{
//                     clientes.push({nome:result.nome, email:result.email, palavra_passe:result.palavra_passe, numero:result.numero,id:result.id})
//                 })
//                 let clientesFiltrados= clientes.filter(cliente =>{
//                     if(cliente.id ==request.params.id){
//                         return cliente
//                     }
//                 })

//                  response.json(clientesFiltrados)   
//             }
//         })
//     }
// })
// app.post("/logn_in/",(request,response)=>{
//     let entrar=request.body;
//     console.log(entrar);
//     if(!connected){
//         response.status(500)
//         response.json({error:"falha na conexao ao sql "});

//     }
//     else if(entrar.email!=undefined && entrar.palavra_passe!=undefined){
//         if(entrar.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/)){
//         connection.query(`select exists(select * from cliente where email="${entrar.email}" and palavra_passe="${entrar.palavra_passe}") as valor`,(error,results,fields)=>{
//                 if(error){
//                     console.log(error)
//                     response.json(error)
//                 } else{
//                     if(results[0].valor){
//                         // encontrado
//                         response.json({message:"efectuado com sucesso"});
//                     } else {
//                         // nao encontrado
//                         response.json({message:"nao e possivel"})
//                     }
//                 }
                
//             })
//         }
        