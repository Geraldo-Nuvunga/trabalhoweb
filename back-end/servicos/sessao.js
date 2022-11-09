

import e, { request, response } from "express";
import app from "../configuracao/app.js";
import{connected, connection} from "../configuracao/mysql.js";
import { redirect} from "../servicos/pages.js";


function handleInvalidCookie(request,response, callback){
    response.clearCookie("cid");
    if(callback)
        callback(request,response)
    else
        response.json({message:"invalid_cookie"});
}

function handlevalidCookie(request,response,user_data ,callback){
    if(callback)
        callback(request,response, user_data)
    else
        response.json({message:"valid_cookie"});

}
function handleValidAdmincookie(request,response,userdata,callback){
    if(callback)
         callback (request,response,userdata)
    else
        response.json({massage:"valido_admini_cookie"});
}
 
function handleNoCookie(request,response,callback){
    response.clearCookie("cid");
    if(callback)
        callback(request,response)
    else
        response.json({message:"no_cookie"});
}




export function trataSobSessao (request,response ,no_cookie_callback, invalid_cookie_callback,valid_cookie_callback){
    let codigo= request.cookies.cid;
    codigo =(Number(codigo).toString()== "NaN" || codigo == undefined || codigo == 'undefined' || codigo =='') ?
    undefined :Number(codigo);
        console.log(codigo);
   
    if(connected){
        if(codigo != undefined){
            connection.query(`select host,id_cliente from cookie where codigo=${Number(codigo)};`,(error,results,fields)=>{
                if(error){
                    response.status(500);
                    response.json({error:"impossivel obter dados a partir do cookie,SQL:"+ error})
                }
                //cookie invalido
                else if (!results.length){
                    handleInvalidCookie(request,response,invalid_cookie_callback)
                }
                //cookie existente
                else {
                   connection.query(`select * from cliente where id= ${Number(results[0].id_cliente)};`,(user_error,user_results)=>{
                        if(user_error){
                            response.status(500);
                            response.json({error:"(2) impossivel obter dados de clientes a partir do cookie,SQL:"+user_error})
                        } else if (!user_results.length){
                            handleInvalidCookie(request,response,invalid_cookie_callback)
                        }else{
                           connection.query(`select exists(select * from administrador where id_cliente=(select id_cliente from cookie where codigo =${codigo})) as admin`,(error,results)=>{
                                if(error){
                                    response.status(500);
                                    response.json({error:"(5) impossivel obter dados de usuario a partir do cooki, sql:"+error})
                                } else {
                                    if(results[0].admin){
                                        handleValidAdmincookie(request,response,user_results[0],valid_admi_cookie)
                                    } else{
                                        handleValidAdmincookie(request, response,user_results[0],valid_cookie_callback)
                                    }
                                }
                           })
                        }
                   })
                }
            });
            // nenhum cookie detectado

        } else {
            handleNoCookie(request,response,no_cookie_callback);
        }
    }
}

function gerarRespostaComCookie(host,email,palavra_passe,response,callback){
    let hora_actual = new Date ()
    if(connected){
        let codigo = -2;
        connection.query(`call novo_cookie("${host}","${email}","${palavra_passe}","${hora_actual.getFullYear()}-${hora_actual.getMonth()}-${hora_actual.getDate()}");`,(error,results,fields)=>{
            if(!error){
                console.log("cookie id: "+results[0]);
                response.cookie("cid",results[0][0].cookie);
                callback(response);

            }else {
                console.log(error);
            }
        });
    } else {
        response.status(500);
        response.json({error: "nao conectado ao BD"});
    }
}

export function usarSessao(){
    app.get("/sessao/",(request,response)=>{
      trataSobSessao(request,response,
        (request,response)=>{
        response.send("sem cookie")
      },(request,response)=>{
        response.send("cookie invalido")
      },(request,response,user_data)=>{
        response.send("cookie valido," + user_data.nome)
      },(request,response,user_data)=>{
        response.send("cookie admini valido,"+user_data)
      }
      );
    
    })

    app.post("/sair/",(request,response)=>{
        response.clearCookie("cid");
        response.json({message:"ok"})
    })

    app.post("/contacto/", (request,response)=>{
        let new_contacto=request.body
        console.log(new_contacto);
        if(!connected){
            response.status(500)
            response.json({error:"falha na conexao ao sql"})
        }
        else if (new_contacto.nome_cliente!=undefined && new_contacto.email_cliente!=undefined && new_contacto.celular!=undefined && new_contacto.nome_da_empresa!=undefined && new_contacto.assuntos!=undefined && new_contacto.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/) && new_contacto.descricao!=undefined){
            new_contacto.nome_cliente=new_contacto.replaceAll(/'|"/g,':')
            new_contacto.celular=Number(new_contacto.celular);
            connection.query(`insert into contacto(nome_cliente,email_cliente,celular,nome_da_empresa,assuntos,descricao) values("${nome_cliente}","${email_cliente}","${celular}","${nome_da_empresa}","${assuntos}","${descricao}")`,(error,results)=>{
                if(!error){
                    response.status(200)
                    response.json({massage:"enviada mensagem com sucesso"})

                }
                else{
                    response.status(500)
                    response.json({error:erro})
                }
            })
        }

    })


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
            connection.query(`insert into cliente(nome,email,palavra_passe,numero) values("${new_cliente.nome}","${new_cliente.email}","${new_cliente.palavra_passe}",${new_cliente.numero})`, (error, results)=>{
                if(!error){
                    gerarRespostaComCookie(request.hostname, new_cliente.email, new_cliente.palavra_passe, response, (response)=>{
                        redirect(request,response, "/pages/pagina-de-dashborder.html");
                    })
                }
            })
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
    


    app.post("/login/",(request,response)=>{
        let novo_login=request.body;
        console.log("LOGIN");
        if(!connected){
            response.status(500)
            response.json({error:"falha na conexao ao sql "});
        }
        else if(novo_login.email!=undefined && novo_login.palavra_passe!=undefined){
            if(novo_login.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/)){
            connection.query(`select exists(select * from cliente where email="${novo_login.email}" and palavra_passe="${novo_login.palavra_passe}") as valor`,(error,results,fields)=>{
                    if(error){
                        console.log(error)
                        response.json({error:"erro interno"+ error})
                    } else{
                        if(results[0].valor){
                            // encontrado
                            gerarRespostaComCookie(request.hostname,novo_login.email,novo_login.palavra_passe,response,(response)=>{
                                redirect(request,response, "/pages/pagina-de-dashborder.html"); 
                            })
                            ;
                        } else {
                            response.clearCookie("cid");
                            // nao encontrado
                            response.status(404)
                            response.json({message:"dados invalidos"})
                        }
                    }
                    
                })
            }            
        }else {
            response.status(500);
            response.json({erro:"dados invalidos."})
        }
    })
    app.post("/recuperar/", (request,response)=>{
        let rec_senha=request.body;
        console.log(rec_senha);
        if(!connected){
            response.status(500)
            response.json({error:"falha na conexao ao sql"});
        }
        else if(rec_senha.email!=undefined){
            if(rec_senha.email.match(/^[a-zA-Z]\w+.@[a-zA-Z]\w+.\w+$/)){
                connection.query(`select exists(select * from cliente where email="${rec_senha.email}") as valor`,(error,results,fields)=>{
                    if(error){
                        console.log(error)
                        response.json(error)
                    }else{
                        if(results[0].valor){
                            //encontrado
                            response.json({
                                massage:"efectuado com sucesso o seu pedido."
                            });
                        } else {
                            // nao encontrado
                            response.json({
                                message:"nao foi possivel"
                            })
                        }
                    }
                })
            }
        }
    }) 

}
