"use strict";

// Protótipo: todos os dados abaixo existem somente na memória desta página.
// Recarregar o navegador restaura os dados fictícios iniciais.
const TOTAL_MESAS = 12;
const pedidos = [
  { id: 1, mesa: 2, itens: [{ nome: "Prato executivo", quantidade: 2 }], observacoes: "", horario: "12:20" },
  { id: 2, mesa: 5, itens: [{ nome: "Suco natural", quantidade: 2 }, { nome: "Sanduíche", quantidade: 1 }], observacoes: "", horario: "12:35" },
  { id: 3, mesa: 9, itens: [{ nome: "Café", quantidade: 2 }], observacoes: "Sem açúcar", horario: "13:10" },
];

let mesaSelecionada = 1;
let itensRascunho = [];
let proximoId = 4;

const $ = (seletor) => document.querySelector(seletor);
const gradeMesas = $("#lista-mesas");
const historicoPedidos = $("#pedidos-mesa");
const listaRascunho = $("#itens-pedido");
const form = $("#form-pedido");
const campoItem = $("#nome-item");
const campoQuantidade = $("#quantidade-item");
const campoObservacoes = $("#observacoes");
const mensagemFormulario = $("#mensagem-formulario");

function nomeMesa(numero) {
  return `Mesa ${String(numero).padStart(2, "0")}`;
}

function pedidosDaMesa(numero) {
  return pedidos.filter((pedido) => pedido.mesa === numero);
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function renderizarMesas() {
  const fragmento = document.createDocumentFragment();
  let ocupadas = 0;

  for (let numero = 1; numero <= TOTAL_MESAS; numero++) {
    const totalPedidos = pedidosDaMesa(numero).length;
    const ocupada = totalPedidos > 0;
    if (ocupada) ocupadas++;

    const botao = criarElemento("button", "table-card");
    botao.type = "button";
    botao.dataset.mesa = String(numero);
    botao.setAttribute("aria-pressed", String(numero === mesaSelecionada));
    botao.setAttribute("aria-label", `${nomeMesa(numero)}, ${ocupada ? "ocupada" : "livre"}. Selecionar mesa.`);
    botao.append(criarElemento("span", "table-label", nomeMesa(numero)));

    const rodape = criarElemento("span", `card-bottom${ocupada ? " busy-text" : ""}`);
    rodape.append(criarElemento("i", `status-dot ${ocupada ? "busy" : "free"}`));
    rodape.append(document.createTextNode(ocupada ? "Ocupada" : "Livre"));
    botao.append(rodape);
    botao.addEventListener("click", () => selecionarMesa(numero));
    fragmento.append(botao);
  }

  gradeMesas.replaceChildren(fragmento);
  $("#total-mesas").textContent = String(TOTAL_MESAS);
  $("#mesas-livres").textContent = String(TOTAL_MESAS - ocupadas);
  $("#mesas-ocupadas").textContent = String(ocupadas);
}

function renderizarDetalhes() {
  const encontrados = pedidosDaMesa(mesaSelecionada);
  const situacao = $("#situacao-mesa");
  $("#titulo-detalhes").textContent = nomeMesa(mesaSelecionada);
  $("#mesa-selecionada").textContent = nomeMesa(mesaSelecionada);
  situacao.textContent = encontrados.length ? "Ocupada" : "Livre";
  situacao.className = `status-pill${encontrados.length ? " busy" : ""}`;

  if (!encontrados.length) {
    historicoPedidos.replaceChildren(criarElemento("p", "empty-message", "Esta mesa ainda não possui pedidos cadastrados."));
    return;
  }

  const lista = criarElemento("ul", "history-list");
  for (const pedido of encontrados) {
    const card = criarElemento("li", "history-card");
    const cabecalho = criarElemento("div", "history-header");
    cabecalho.append(criarElemento("strong", "", `Pedido #${String(pedido.id).padStart(3, "0")}`));
    cabecalho.append(criarElemento("span", "", pedido.horario));
    card.append(cabecalho);

    const itens = criarElemento("ul", "history-items");
    for (const item of pedido.itens) {
      itens.append(criarElemento("li", "", `${item.quantidade} × ${item.nome}`));
    }
    card.append(itens);
    if (pedido.observacoes) card.append(criarElemento("p", "history-note", `Obs.: ${pedido.observacoes}`));
    lista.append(card);
  }
  historicoPedidos.replaceChildren(lista);
}

function selecionarMesa(numero) {
  mesaSelecionada = numero;
  renderizarMesas();
  renderizarDetalhes();
  mostrarMensagem("");
}

function mostrarMensagem(texto, tipo = "") {
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = `form-message${tipo ? ` ${tipo}` : ""}`;
}

function validarItem() {
  const nome = campoItem.value.trim().replace(/\s+/g, " ");
  const numero = Number(campoQuantidade.value);
  campoItem.removeAttribute("aria-invalid");
  campoQuantidade.removeAttribute("aria-invalid");

  if (!nome) {
    campoItem.setAttribute("aria-invalid", "true");
    campoItem.focus();
    mostrarMensagem("Informe o nome do item.", "error");
    return null;
  }
  if (!Number.isInteger(numero) || numero < 1 || numero > 99) {
    campoQuantidade.setAttribute("aria-invalid", "true");
    campoQuantidade.focus();
    mostrarMensagem("Informe uma quantidade inteira entre 1 e 99.", "error");
    return null;
  }
  return { nome, quantidade: numero };
}

function renderizarRascunho() {
  const total = itensRascunho.length;
  $("#contador-itens").textContent = `${total} ${total === 1 ? "item" : "itens"}`;
  if (!total) {
    listaRascunho.replaceChildren(criarElemento("li", "empty-draft", "Nenhum item adicionado."));
    return;
  }

  const fragmento = document.createDocumentFragment();
  itensRascunho.forEach((item, indice) => {
    const li = criarElemento("li", "draft-item");
    const dados = criarElemento("span", "draft-item-name");
    dados.append(criarElemento("span", "draft-quantity", `${item.quantidade}×`));
    dados.append(document.createTextNode(item.nome));

    const remover = criarElemento("button", "remove-item", "Remover");
    remover.type = "button";
    remover.setAttribute("aria-label", `Remover ${item.nome} do pedido`);
    remover.addEventListener("click", () => {
      itensRascunho.splice(indice, 1);
      renderizarRascunho();
      mostrarMensagem("");
    });
    li.append(dados, remover);
    fragmento.append(li);
  });
  listaRascunho.replaceChildren(fragmento);
}

function adicionarItem() {
  const item = validarItem();
  if (!item) return false;
  itensRascunho.push(item);
  campoItem.value = "";
  campoQuantidade.value = "1";
  renderizarRascunho();
  mostrarMensagem("");
  campoItem.focus();
  return true;
}

$("#adicionar-item").addEventListener("click", adicionarItem);

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  // Permite cadastrar diretamente um único item sem clicar em "Adicionar item".
  if (campoItem.value.trim() || campoQuantidade.value !== "1") {
    if (!adicionarItem()) return;
  }
  if (!itensRascunho.length) {
    mostrarMensagem("Adicione pelo menos um item antes de cadastrar o pedido.", "error");
    campoItem.focus();
    return;
  }

  const id = proximoId++;
  pedidos.push({
    id,
    mesa: mesaSelecionada,
    itens: itensRascunho.map((item) => ({ ...item })),
    observacoes: campoObservacoes.value.trim(),
    horario: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
  });
  itensRascunho = [];
  form.reset();
  renderizarRascunho();
  renderizarMesas();
  renderizarDetalhes();
  mostrarMensagem(`Pedido #${String(id).padStart(3, "0")} cadastrado para a ${nomeMesa(mesaSelecionada)}.`, "success");
});

renderizarMesas();
renderizarDetalhes();
renderizarRascunho();
