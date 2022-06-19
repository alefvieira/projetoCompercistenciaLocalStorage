let index = -1;
let listaInventario = [];
popularTabela()

const adicionar = ()=> { 
    // esses condicionais vai validar os campos de cadastro do formulário
    let nome    = ($("#nome").val().trim().length > 0)? $("#nome").val() : null;
    let qtd     = (parseInt($("#qtd").val()) > 0 )? parseInt($("#qtd").val()) : null;
    let valor   = (parseFloat($("#valor").val()) > 0)? converteFloat($("#valor").val()) : null;
    let condicao= ($("#condicao").val() !== "")? $("#condicao").val() : null;
    let dataC   = (validaData($("#data-c").val()))? converteData($("#data-c").val()): null;
    let fabric  = $("#fabric").val()
    let modelo  = $("#modelo").val()
    let nSerie  = $("#n-serie").val()


    let validacao = $(".validacao");;

    if( nome === null || qtd === null || valor === null || condicao === null || dataC === null){
        validacao.html("");
        (nome === null)? validacao.append("<p class=\"red\">O Nome obrigatório!</p>") : '';
        (qtd === null)?  validacao.append("<p class=\"red\">A Quantidade deve ser maior que 0!</p>") : '';
        (valor === null)? validacao.append("<p class=\"red\">O valor não pode estar vazio ou ser menor ou igual a 0!</p>") : '';
        (condicao === null)? validacao.append("<p class=\"red\">A condição não pode estar vazio!</p>") : '';
        (dataC === null)? validacao.append("<p class=\"red\">A data está incorreta!</p>") : '';
    }
    else{
        validacao.html("");
        let obj = {
            'nome':     nome,
            'qtd':      qtd,
            'valor':    valor,
            'condicao': condicao,
            'dataC':    dataC,
            'fabric':   fabric,
            'modelo':   modelo,
            'nSerie':   nSerie,
        }
        // se o indice for menor que 0 será feito o cadastro
        if(index < 0){
            listaInventario.push(obj)
            persistencia(listaInventario);
            validacao.append("<p class=\"green\">Dados cadastrados com Sucesso!.</p>");
            criarModalConfim("Dados cadastrados com Sucesso!");
        }
        else{
            listaInventario.splice(index, 1, obj)
            persistencia(listaInventario);
            validacao.append("<p class=\"green\">Dados Alterados com Sucesso!.</p>");
            criarModalConfim("Dados Alterados com Sucesso!");
            index = -1;
        }
        popularTabela()
        clean();
        
        
    }
}



// essa função vai converter os valores String em valores float e vice versa
const converteFloat = (n)=>{
    let numero;
    if(String(n).includes(',')){
        numero = Number.parseFloat(n.trim().replace(',','.').replaceAll(',',''));
    }else{
        numero = String(n).replace('.',',')
    }
    return numero;
}


// impede que que certos caracteres sejam digitados
$("#valor").keypress(function(e){
    if(!checkChar(e)) {
        e.preventDefault();
    }
})
function checkChar(e) {
    var char = String.fromCharCode(e.keyCode);
    var pattern = '[0-9,]';
    if (char.match(pattern)) {
      return true;
  }
}


// FUNções de data da compra
const validaData = (dataC)=>{
    if((dataC <= dataAtual() && dataC != "")){
        return true;
    }
    return false;
}
const dataAtual = () =>{
    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    return `${ano}-${mes}-${dia}`;
    
}

// função que vai converter a data
const converteData = (dataC) =>{
    if(dataC.includes('-')){
        const dataPt = dataC.split('-');
        return `${dataPt[2]}/${dataPt[1]}/${dataPt[0]}`;
    }
    else {
        const dataIng = dataC.split('/');
        return `${dataIng[2]}-${dataIng[1]}-${dataIng[0]}`;
    }
    
}

// vai adicionar em localStorage
const persistencia = (obj) =>{
    const jsonOBJ = JSON.stringify(obj)
    localStorage.setItem("Inventario", jsonOBJ);
}

// função que vai limpar os campos
const clean = () =>{
    $("#nome").val("")
    $("#qtd").val("")
    $("#valor").val("")
    $("#condicao").val("")
    $("#data-c").val("")
    $("#fabric").val("")
    $("#modelo").val("")
    $("#n-serie").val("")
}

// função que vai criar as linhas e colunas do iventário
function popularTabela(){
    const inventarioJSON= localStorage.getItem("Inventario")

    // esse condicional vai verificar se a lista está vazia, caso esteja, os valores do localstorage vão ser passados para ela
    let devepopularArray = false;
    if(inventarioJSON !== null){
        if(listaInventario.length <= 0){
            devepopularArray = true;
        }

        $(".informacaoDados").html("")
        const inventarioOBJ = JSON.parse(inventarioJSON)
        let linhas_daTabela = $(".list-invet table tbody")

        linhas_daTabela.html("")
        inventarioOBJ.forEach( (element, indice )=> {

            // esse condicional vai verificar se a lista está vazia, caso esteja será populado com os elementos do localstorage
            if(devepopularArray == true) listaInventario.push(element);

            linhas_daTabela.append(
                `<tr>
                    <td>${element.nome}</td>
                    <td>${element.valor}</td>
                    <td>${element.qtd}</td>
                    <td>${element.condicao}</td>
                    <td>${element.dataC}</td>
                    <td>
                    <button class="btn-remove" onclick="criarModalDelete(${indice})" title="Clique aqui para Remover">
                        <img src="img/trash-can-solid.svg"/>
                    </button>

                    <button class="btn-edit" onclick="editar(${indice})" title="Clique aqui para Editar"> 
                        <img src="img/pen-to-square-solid.svg"/>
                    </button>
                    </td>
                </tr>`)
        });
        if(inventarioJSON === '[]'){
            $(".informacaoDados").append("<p>Sem registros</p>")
        }
    }else{
        $(".informacaoDados").append("<p>Sem registros</p>")
    }   
}


// função que vai deletar o indice do array
const  deletar = (indice) =>{

        listaInventario.splice(indice, 1)
        persistencia(listaInventario);
        popularTabela();
        hideModal();
}

// condição que vai preencher os campos
const editar = (indice) => {
    $("#nome").val(listaInventario[indice].nome)
    $("#qtd").val(listaInventario[indice].qtd)
    $("#valor").val(converteFloat(listaInventario[indice].valor))
    $("#condicao").val(listaInventario[indice].condicao)
    $("#data-c").val(converteData(listaInventario[indice].dataC))
    $("#fabric").val(listaInventario[indice].fabric)
    $("#modelo").val(listaInventario[indice].modelo)
    $("#n-serie").val(listaInventario[indice].nSerie)
    index = indice;
    
}


// funções para as modais
// essa função vai tornar a modal visivel
const showModal = ()=>{
    var element = $(".modal")
    element.addClass("show-modal");
}

// esconde a modal
const hideModal = ()=>{
    var element = $(".modal")
    element.removeClass("show-modal");
}

// caso o seja precionado a tecla 'ESC' o modal será fechado
$("body").keydown(function(e){
    if(e.keyCode == 27) {
        hideModal();
    }

})

// essa função vai criar o modal passando por paramentro o indice, que ao ser executado a função deletar, o indice será apagado
function criarModalDelete(indice){
    $("#modal-view").html(`
    <div class="modal">
        <div class="modal-content">
            <span class="fechar-modal" onclick="hideModal()">&times;</span>
            <h3>Tem certeza que deseja excluir o item do Inventário? </h3>
            <button class="botao-padrao" onclick="deletar(${indice})" >Sim</button> 
            <button class="botao-padrao" onclick="hideModal()">Não</button> 
        </div>
    </div>
    `)
    showModal()
}

function criarModalConfim(texto){
    $("#modal-view").html(`
    <div class="modal">
        <div class="modal-content">
            <span class="fechar-modal" onclick="hideModal()">&times;</span>
            <h3>${texto}</h3>
            <button class="botao-padrao" onclick="hideModal()">Ok</button> 
        </div>
    </div>
    `)
    showModal()
}

