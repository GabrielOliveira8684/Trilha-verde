# Trilha Verde

Uma loja virtual interativa de equipamentos para camping e trilha, desenvolvida com HTML, Tailwind CSS e JavaScript puro. O projeto foi estruturado para praticar manipulação do DOM, filtros de dados, persistência no navegador e organização de código em arquivos simples.

## O que ele faz?

A aplicação apresenta um catálogo de equipamentos de trilha e camping. O usuário pode navegar pelos produtos, buscar itens, filtrar por categoria, ordenar os resultados e simular uma compra com carrinho salvo no navegador.

* **Catálogo de produtos:** exibe 12 produtos organizados em 7 categorias: barracas, mochilas, dormir, cozinha, iluminação, calçados e acessórios.
* **Busca, filtros e ordenação:** permite pesquisar por nome, categoria ou descrição, filtrar os produtos por categoria e ordenar por menor preço, maior preço ou ordem alfabética.
* **Ícones personalizados:** cada categoria usa um ícone SVG próprio, que também aparece na imagem dos cards e nos itens do carrinho.
* **Carrinho de compras:** painel lateral para adicionar, aumentar, diminuir ou remover produtos, com cálculo automático do subtotal.
* **Frete grátis:** mostra quanto falta para atingir o frete grátis a partir de R$ 299 e atualiza uma barra de progresso.
* **Carrinho salvo no navegador:** utiliza `localStorage` para manter os produtos no carrinho mesmo depois de fechar ou atualizar a página.
* **Tema claro e escuro:** botão para alternar entre os dois temas sem recarregar a página.
* **Layout responsivo:** adapta o catálogo, os filtros e o cabeçalho para celular, tablet e computador.
* **Finalização simulada:** limpa o carrinho e exibe uma confirmação, sem processar pagamento real.

## Como rodar

Não é necessário instalar Node.js, React ou um servidor. É preciso apenas ter internet, pois o Tailwind CSS e as fontes são carregados por CDN.

1. Baixe ou clone a pasta do projeto.

2. Abra o arquivo `index.html` no navegador.

3. Use a busca, os filtros, a ordenação e o carrinho para testar as funcionalidades.

## Estrutura do projeto

```text
trilha-verde-tailwind/
├── index.html          # Estrutura da página e classes Tailwind
├── README.md           # Documentação do projeto
└── js/
    ├── produtos.js     # Lista de produtos e categorias
    └── script.js       # Busca, filtros, tema e carrinho
```

## O que eu pratiquei e aprendi nesse projeto

Esse projeto foi construído para praticar a criação de uma interface de loja usando código simples e sem frameworks.

* **Tailwind CSS:** uso de classes utilitárias diretamente no HTML para criar o layout, as cores, a responsividade, o painel lateral e os estados de tema claro/escuro.
* **Manipulação do DOM:** os cards, os botões de categoria e os itens do carrinho são gerados e atualizados pelo JavaScript usando `innerHTML`.
* **Arrays e objetos:** produtos são armazenados em um array de objetos; o carrinho é um objeto no formato `{ id: quantidade }`.
* **Filtros e ordenação:** uso de `filter()`, `find()` e `sort()` para pesquisar produtos, aplicar categorias e alterar a ordem do catálogo.
* **Tratamento de texto:** a busca usa `normalize()` para encontrar palavras mesmo quando o usuário digita sem acentos.
* **Funções pequenas:** cada função possui uma responsabilidade, como desenhar produtos, atualizar o carrinho, abrir o painel ou salvar os dados.
* **Eventos:** uso de `addEventListener()` para busca, ordenação, botões do carrinho, troca de tema, clique no fundo e tecla `Escape`.
* **Persistência de dados:** uso de `localStorage`, `JSON.stringify()` e `JSON.parse()` para salvar e recuperar o carrinho.
* **SVGs inline:** os ícones personalizados das categorias são desenhados com SVG no JavaScript, sem depender de biblioteca externa de ícones.
* **Formatação de valores:** preços são exibidos em reais com `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`.
