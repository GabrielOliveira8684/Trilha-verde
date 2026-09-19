const $ = seletor => document.querySelector(seletor);
const dinheiro = valor => valor.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
let categoria = 'Todas';
let busca = '';
let ordem = 'padrao';
let carrinho = JSON.parse(localStorage.getItem('trilha-verde-carrinho') || '{}');
const DESENHOS = {
  'Todas': '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  'Barracas': '<path d="M3 20 12 4l9 16H3Z"/><path d="M8 20 12 13l4 7M12 4v9"/>',
  'Mochilas': '<path d="M7 7h10l2 4v9H5v-9l2-4Z"/><path d="M9 7V5h6v2M8 12h8M9 20v-3h6v3"/>',
  'Dormir': '<path d="M4 7h16v11H4z"/><path d="M4 12h16M7 7v5h4V7M3 18v3M21 18v3"/>',
  'Cozinha': '<path d="M5 4v16M5 9h7M12 4v5M15 4v7a3 3 0 0 0 6 0V4M18 14v6"/>',
  'Iluminação': '<path d="M9 14h6l2 7H7l2-7Z"/><path d="M8 14 6 9l3-5h6l3 5-2 5M12 1v2M4 4l2 2M20 4l-2 2"/>',
  'Calçados': '<path d="M4 5h7v7l3 2 6 1v4H4V5Z"/><path d="M4 15h7M8 8h3"/>',
  'Acessórios': '<circle cx="12" cy="12" r="8"/><path d="m15 9-2 4-4 2 2-4 4-2Z"/><path d="M12 4v2M20 12h-2M12 20v-2M4 12h2"/>'
};

function iconeCategoria(nome, classes) {
  return `<svg class="${classes}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DESENHOS[nome]}</svg>`;
}

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
    const ativa = nome === categoria;
    const estilo = ativa ? 'bg-zinc-200 font-bold text-zinc-900 dark:bg-[#292a2e] dark:text-[#f3f2ef]' : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-[#292a2e] dark:hover:text-[#f3f2ef]';
    return `<button class="flex items-center gap-2 rounded-md px-3 py-2 text-left ${estilo}" onclick="trocarCategoria('${nome}')">${iconeCategoria(nome, 'h-4 w-4 shrink-0')} ${nome}</button>`;
  }).join('');
}

function desenharProdutos() {
  const lista = listaAtual();
  $('#quantidade').textContent = `${lista.length} ${lista.length === 1 ? 'produto' : 'produtos'}`;
  $('#produtos').innerHTML = lista.map(item => `
    <article class="flex min-h-[348px] min-w-0 flex-col border-b border-r border-zinc-300 bg-white p-4 last:border-r-0 dark:border-[#292a2e] dark:bg-[#0d0e10] max-md:min-h-[310px] max-md:p-3">
      <div class="relative mb-3.5 grid h-[158px] place-items-center bg-zinc-200 max-md:h-[120px] dark:bg-[#151619]"><em class="absolute right-2 top-2 border border-zinc-400 px-1.5 py-0.5 font-mono text-[10px] not-italic text-zinc-500 dark:border-[#34353a] dark:text-[#a6a6ae]">REF. ${String(item.id).padStart(2,'0')}</em>${iconeCategoria(item.categoria, 'h-14 w-14 text-[#557764] dark:text-[#91ad9d]')}</div>
      <small class="text-[#527461] dark:text-[#91ad9d]">${item.categoria}</small><h3 class="my-1 text-base font-bold leading-tight">${item.nome}</h3><p class="mb-3 text-xs leading-snug text-zinc-500 dark:text-zinc-400">${item.descricao}</p><strong class="mt-auto font-mono text-base font-medium">${dinheiro(item.preco)}</strong><button class="mt-3 rounded-md border border-zinc-400 p-2 font-bold hover:bg-zinc-200 dark:border-[#515257] dark:hover:bg-[#202125]" onclick="adicionar(${item.id})">Adicionar</button>
    </article>`).join('');
  $('#vazio').hidden = lista.length > 0;
}

function desenharCarrinho() {
  const itens = Object.entries(carrinho).filter(([, qtd]) => qtd > 0);
  const total = itens.reduce((soma, [id, qtd]) => soma + produto(id).preco * qtd, 0);
  $('#contador').textContent = itens.reduce((soma, [, qtd]) => soma + qtd, 0);
  $('#itens-carrinho').innerHTML = itens.length ? itens.map(([id, qtd]) => {
    const item = produto(id);
    return `<div class="grid grid-cols-[42px_1fr_auto] gap-2.5 border-b border-zinc-300 py-3.5 dark:border-[#292a2e]"><b class="grid h-[42px] place-items-center bg-zinc-200 font-normal text-[#557764] dark:bg-[#151619] dark:text-[#91ad9d]">${iconeCategoria(item.categoria, 'h-6 w-6')}</b><div><strong>${item.nome}</strong><small class="mt-1 block text-zinc-500 dark:text-zinc-400">${dinheiro(item.preco)}</small><p class="mt-2"><button class="w-[22px] rounded border border-zinc-300 dark:border-[#292a2e]" onclick="mudarQuantidade(${id},-1)">−</button> ${qtd} <button class="w-[22px] rounded border border-zinc-300 dark:border-[#292a2e]" onclick="mudarQuantidade(${id},1)">+</button><a class="ml-2 cursor-pointer text-xs text-zinc-500 underline dark:text-zinc-400" onclick="remover(${id})">Remover</a></p></div><strong>${dinheiro(item.preco*qtd)}</strong></div>`;
  }).join('') : '<p class="mt-12 text-center text-zinc-500 dark:text-zinc-400">Seu carrinho está vazio.</p>';
  const falta = Math.max(0, 299 - total);
  $('#frete').textContent = falta ? `Faltam ${dinheiro(falta)} para frete grátis` : 'Você ganhou frete grátis';
  $('#progresso').style.width = `${Math.min(100, total / 299 * 100)}%`;
  $('#subtotal').textContent = dinheiro(total);
}

function trocarCategoria(nome) { categoria = nome; desenharCategorias(); desenharProdutos(); }
function adicionar(id) { carrinho[id] = (carrinho[id] || 0) + 1; salvar(); desenharCarrinho(); avisar('Produto adicionado ao carrinho'); }
function mudarQuantidade(id, valor) { carrinho[id] = (carrinho[id] || 0) + valor; if (carrinho[id] <= 0) delete carrinho[id]; salvar(); desenharCarrinho(); }
function remover(id) { delete carrinho[id]; salvar(); desenharCarrinho(); }
function avisar(texto) { $('#aviso').textContent = texto; $('#aviso').classList.add('translate-y-0','opacity-100'); setTimeout(() => $('#aviso').classList.remove('translate-y-0','opacity-100'), 1800); }
function abrirCarrinho() { $('#painel-carrinho').classList.add('translate-x-0'); $('#painel-carrinho').setAttribute('aria-hidden','false'); $('#fundo').hidden = false; }
function fecharCarrinho() { $('#painel-carrinho').classList.remove('translate-x-0'); $('#painel-carrinho').setAttribute('aria-hidden','true'); $('#fundo').hidden = true; }

$('#busca').addEventListener('input', evento => { busca = evento.target.value; desenharProdutos(); });
$('#ordenar').addEventListener('change', evento => { ordem = evento.target.value; desenharProdutos(); });
$('#abrir-carrinho').addEventListener('click', abrirCarrinho);
$('#fechar-carrinho').addEventListener('click', fecharCarrinho);
$('#fundo').addEventListener('click', fecharCarrinho);
$('#tema').addEventListener('click', () => document.documentElement.classList.toggle('dark'));
$('#finalizar').addEventListener('click', () => { if (Object.keys(carrinho).length) { carrinho = {}; salvar(); desenharCarrinho(); avisar('Pedido simulado com sucesso'); } });
document.addEventListener('keydown', evento => { if (evento.key === 'Escape') fecharCarrinho(); });
desenharCategorias(); desenharProdutos(); desenharCarrinho();
