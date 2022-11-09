import app from "./configuracao/app.js"
import {connected, connection } from "./configuracao/mysql.js"
import {usarSessao } from "./servicos/sessao.js"
import { usarServicoPaginas } from "./servicos/pages.js"
import { usarServicoImagens } from "./servicos/imagens.js"
import { usarServicoEstilos} from "./servicos/estilos.js"
import { userDataService} from "./servicos/user_data.js"

usarSessao()
usarServicoPaginas();
usarServicoImagens();
usarServicoEstilos();
userDataService();


app.listen(8081)