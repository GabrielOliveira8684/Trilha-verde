const $ = seletor => document.querySelector(seletor);
const dinheiro = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let categoria = 'Todas';
let busca = '';
let ordem = 'padrao';
let carrinho = JSON.parse(localStorage.getItem('trilha-verde-carrinho') || '{}');

// cor de fundo de cada categoria (só pra dar um visual diferente em cada produto)
const CORES = {
  'Barracas': 'bg-emerald-100 dark:bg-emerald-950',
  'Mochilas': 'bg-amber-100 dark:bg-amber-950',
  'Dormir': 'bg-sky-100 dark:bg-sky-950',
  'Cozinha': 'bg-orange-100 dark:bg-orange-950',
  'Iluminação': 'bg-yellow-100 dark:bg-yellow-950',
  'Calçados': 'bg-stone-200 dark:bg-stone-700',
  'Acessórios': 'bg-lime-100 dark:bg-lime-950'
};

function salvar() { localStorage.setItem('trilha-verde-carrinho', JSON.stringify(carrinho)); }
function produto(id) { return PRODUTOS.find(item => item.id === Number(id)); }
function normalizar(texto) { return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

function listaAtual() {
  const texto = normalizar(busca);
  const lista = PRODUTOS.filter(item => (categoria === 'Todas' || item.categoria === categoria) && normalizar(`${item.nome} ${item.categoria} ${item.descricao}`).includes(texto));
  if (ordem === 'menor') lista.sort((a, b) => a.preco - b.preco);
  if (ordem === 'maior') lista.sort((a, b) => b.preco - a.preco);
  if (ordem === 'nome') lista.sort((a, b) => a.nome.localeCompare(b.nome));
  return lista;
}

function desenharCategorias() {
  $('#categorias').innerHTML = CATEGORIAS.map(nome => {
    const estilo = nome === categoria
      ? 'bg-mata text-white font-semibold'
      : 'bg-white hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700';
    return `<button class="rounded px-3 py-1.5 text-left ${estilo}" onclick="trocarCategoria('${nome}')">${nome}</button>`;
  }).join('');
}

function desenharProdutos() {
  const lista = listaAtual();
  $('#quantidade').textContent = `${lista.length} ${lista.length === 1 ? 'produto' : 'produtos'}`;
  $('#produtos').innerHTML = lista.map(item => `
    <article class="flex flex-col overflow-hidden rounded border border-stone-300 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div class="grid h-32 place-items-center text-6xl ${CORES[item.categoria]}">${item.icone}</div>
      <div class="flex flex-1 flex-col p-3">
        <h3 class="font-bold leading-tight">${item.nome}</h3>
        <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">${item.descricao}</p>
        <p class="mt-auto pt-3 text-lg font-bold">${dinheiro(item.preco)}</p>
        <button class="mt-2 rounded bg-laranja py-2 font-semibold text-white hover:opacity-90" onclick="adicionar(${item.id})">Adicionar ao carrinho</button>
      </div>
    </article>`).join('');
  $('#vazio').hidden = lista.length > 0;
}

function desenharCarrinho() {
  const itens = Object.entries(carrinho).filter(([, qtd]) => qtd > 0);
  const total = itens.reduce((soma, [id, qtd]) => soma + produto(id).preco * qtd, 0);
  $('#contador').textContent = itens.reduce((soma, [, qtd]) => soma + qtd, 0);
  $('#itens-carrinho').innerHTML = itens.length ? itens.map(([id, qtd]) => {
    const item = produto(id);
    return `<div class="flex gap-3 border-b border-stone-200 py-3 dark:border-neutral-700">
      <div class="grid h-12 w-12 shrink-0 place-items-center rounded text-2xl ${CORES[item.categoria]}">${item.icone}</div>
      <div class="flex-1">
        <strong>${item.nome}</strong>
        <p class="text-sm text-stone-600 dark:text-stone-400">${dinheiro(item.preco)}</p>
        <p class="mt-1">
          <button class="w-7 rounded border border-stone-300 dark:border-neutral-600" onclick="mudarQuantidade(${id},-1)" aria-label="Diminuir quantidade">−</button>
          <span class="mx-1">${qtd}</span>
          <button class="w-7 rounded border border-stone-300 dark:border-neutral-600" onclick="mudarQuantidade(${id},1)" aria-label="Aumentar quantidade">+</button>
          <button class="ml-2 text-sm text-stone-600 underline dark:text-stone-400" onclick="remover(${id})">Remover</button>
        </p>
      </div>
      <strong>${dinheiro(item.preco * qtd)}</strong>
    </div>`;
  }).join('') : '<p class="mt-12 text-center text-stone-600 dark:text-stone-400">Seu carrinho está vazio.</p>';
  const falta = Math.max(0, 299 - total);
  $('#frete').textContent = falta ? `Faltam ${dinheiro(falta)} para frete grátis` : 'Você ganhou frete grátis';
  $('#progresso').style.width = `${Math.min(100, total / 299 * 100)}%`;
  $('#subtotal').textContent = dinheiro(total);
}

function trocarCategoria(nome) { categoria = nome; desenharCategorias(); desenharProdutos(); }
function adicionar(id) { carrinho[id] = (carrinho[id] || 0) + 1; salvar(); desenharCarrinho(); avisar('Produto adicionado ao carrinho'); }
function mudarQuantidade(id, valor) { carrinho[id] = (carrinho[id] || 0) + valor; if (carrinho[id] <= 0) delete carrinho[id]; salvar(); desenharCarrinho(); }
function remover(id) { delete carrinho[id]; salvar(); desenharCarrinho(); }
function avisar(texto) {
  $('#aviso').textContent = texto;
  $('#aviso').classList.remove('opacity-0');
  setTimeout(() => $('#aviso').classList.add('opacity-0'), 1800);
}
function abrirCarrinho() { $('#painel-carrinho').classList.remove('translate-x-full'); $('#painel-carrinho').setAttribute('aria-hidden', 'false'); $('#fundo').hidden = false; }
function fecharCarrinho() { $('#painel-carrinho').classList.add('translate-x-full'); $('#painel-carrinho').setAttribute('aria-hidden', 'true'); $('#fundo').hidden = true; }

$('#busca').addEventListener('input', evento => { busca = evento.target.value; desenharProdutos(); });
$('#ordenar').addEventListener('change', evento => { ordem = evento.target.value; desenharProdutos(); });
$('#abrir-carrinho').addEventListener('click', abrirCarrinho);
$('#fechar-carrinho').addEventListener('click', fecharCarrinho);
$('#fundo').addEventListener('click', fecharCarrinho);
$('#tema').addEventListener('click', () => document.documentElement.classList.toggle('dark'));
$('#finalizar').addEventListener('click', () => {
  if (Object.keys(carrinho).length) { carrinho = {}; salvar(); desenharCarrinho(); avisar('Pedido simulado com sucesso'); }
});
document.addEventListener('keydown', evento => { if (evento.key === 'Escape') fecharCarrinho(); });
desenharCategorias(); desenharProdutos(); desenharCarrinho();