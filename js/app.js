$(document).ready(function () {
    cardapio.eventos.init();
});


var cardapio = {};
var MEU_CARRINHO = [];

cardapio.eventos = {
    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    // L = 185
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {
        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }

        })

        // remove o ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },

    // clique no botão de ver mais L = 229
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    //diminuir a quantidade de item do cardápio L = A PARTIR DA 185
    diminuirQuantidade: (id) => {
        let qntdtOTAL = parseInt($("#qntd-" + id).text())

        if (qntdtOTAL > 0) {
            $("#qntd-" + id).text(qntdtOTAL - 1)
        }
    },

    //aumentar a quantidade de item do cardápio
    aumentarQuantidade: (id) => {
        let qntdtOTAL = parseInt($("#qntd-" + id).text())
        $("#qntd-" + id).text(qntdtOTAL + 1)
    },

    // adicionar ao carrinho l = 19
    adicionarAoCarrinho: (id) => {
        let qntdAtuaL = parseInt($("#qntd-" + id).text())
        if (qntdAtuaL > 0) {
            // obter a categoria ativa (saber em qual categoria ATIVA está e filtrar o menu para buscar as propriedade dos itens)
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obter a lista de itens
            let filtro = MENU[categoria];

            //pegar os itens peo id que eu escolhi na lista
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                //validar se o item já existe no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                //caso já exista no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtuaL;
                }
                //caso não exista o item no carrinho, apenas alterar a quantidade
                else {
                    item[0].qntd = qntdAtuaL;
                    MEU_CARRINHO.push(item[0])
                }

                // Zerar o número de itens no cartão
                cardapio.metodos.mensagem('item adicionado ao carrinho com sucesso', 'green');
                $("#qntd-" + id).text(0);

                //chamando o método de atualizar o número de itens do carrinho
                cardapio.metodos.atualizarBadgeTotal();
            }
        }
    },

    //atualizar o badge (valor) total dos botões do "meu carrinho" L = 54
    atualizarBadgeTotal: (id) => {
        var total = 0;
        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden')
            $(".container-total-carrinho").removeClass('hidden')
        } else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").removeClass('hidden')
        }
        $(".badge-total-carrinho").html(total)
    },


    //abrir a modal de carrinho L = 449 
    abrirCarrinho: (abrir) => {
        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarEtapa(1)
        } else {
            $("#modalCarrinho").addClass('hidden');
        }
    },

    carregarEtapa: (etapa) => {
        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }
        
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
    },

    //botão pra voltar etapa l = 634
    voltarEtapa: () =>{
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },




    //Mensagens L = 16
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        //pega um número aleatório e multiplica pela data atual
        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class=" animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    },


}


cardapio.templates = {
    item: `
    <div class="col-3 mb-5">
                            <div class="card card-item" id="\${id}">
                                <div class="img-produto">
                                    <img src="\${img}" />
                                </div>
                                <p class="title-produto text-center mt-4">
                                    <b> \${nome}  </b>
                                </p>
                                <p class="price-produto text-center">
                                    <b>R$\${preco}</b>
                                </p>

                                <div class="add-carrinho">
                                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                                    <span class="btn-numero-itens" id="qntd-\${id}">0</span>
                                    <span class="btn-mais"  onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                                    <span class="btn-add" onclick="cardapio.metodos.adicionarAoCarrinho ('\${id}')"><i class="fa fa-shopping-bag"></i></span>

                                </div>  
                            </div>
                        </div>
    
                        `
}