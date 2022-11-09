import mysql from "mysql";



let connection=mysql.createConnection({
    host:"localhost",
    user:"WebSoft",
    password:"websoft",
    database:"Projecto_final",
})
let connected=false;


    if(!connected){
        connection.connect((error)=>{
            if(error){
                console.log({error:error});
            }else{
                console.log("conectado")
                connected=true
            }
        })

    } 
    

    export{connected,connection};
