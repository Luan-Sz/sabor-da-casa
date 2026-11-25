# Sabor da Casa — Front-end

## Acesso rápido à demonstração

### [▶ ABRIR O SISTEMA — GITHUB PAGES](https://luan-sz.github.io/sabor-da-casa/)

> Se a página ainda não abrir, é necessário ativar o GitHub Pages em **Settings → Pages → Deploy from a branch → main → / (root)**. [Abrir configuração](https://github.com/Luan-Sz/sabor-da-casa/settings/pages).

Protótipo acadêmico de **consulta de mesas e cadastro de pedidos**, sem back-end e sem persistência de dados.

## Como executar

Abra `index.html` em um navegador moderno. Não é necessário instalar dependências ou iniciar servidor.

## Funcionalidades

- Consultar 12 mesas demonstrativas, com indicação de livre ou ocupada.
- Selecionar uma mesa e visualizar os pedidos dela.
- Adicionar itens (nome e quantidade) e observações opcionais a um pedido.
- Cadastrar o pedido e atualizar a situação da mesa na interface.
- Validar campos obrigatórios e quantidades.

**Importante:** os três pedidos iniciais são apenas exemplos. Os novos pedidos ficam na memória JavaScript e são perdidos ao atualizar ou fechar a página. Não há banco de dados, API, `localStorage` ou autenticação.

## Arquivos

- `index.html` — estrutura das telas.
- `styles.css` — visual responsivo.
- `app.js` — consulta e cadastro apenas em memória.
