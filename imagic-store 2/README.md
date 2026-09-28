# iMagic Store

Site de vendas de iPhones e eletrônicos (Samsung, Xiaomi e JBL), feito em HTML, CSS e JavaScript puro — sem frameworks, sem build, sem dependências.

## Estrutura do projeto

```
imagic-store/
├── index.html          → página única (site + Estoque + Marcas)
├── css/
│   └── style.css       → todo o estilo do site
├── js/
│   └── app.js          → toda a interatividade (menus, estoque, marcas, formulário)
└── Img/
    ├── logo.png
    ├── hero-photo.jpg
    ├── bg-marble-silver.jpg
    ├── apple-logo.png / samsung-logo.jpg / xiaomi-logo.jpg / jbl-logo.png
    └── produtos/        → coloque aqui as fotos dos aparelhos (veja LEIAME.txt)
```

## Como abrir localmente

Não precisa de servidor nem instalação. Basta abrir o `index.html` em qualquer navegador (duplo clique nele).

## Como publicar (GitHub Pages)

1. Suba este repositório para o GitHub (veja o passo a passo que o Claude te enviou no chat).
2. No repositório, vá em **Settings → Pages**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`, depois **Save**.
4. Em alguns minutos o site estará no ar em `https://SEU-USUARIO.github.io/imagic-store/`.

## Área de Estoque

Acessível pelo menu do site (senha padrão: `imagic2026`, definida em `js/app.js` na constante `STOCK_PASSWORD`). Os produtos cadastrados ficam salvos no navegador de quem acessa (localStorage), não em um banco de dados compartilhado.

## Fotos dos produtos

A pasta `Img/produtos/` tem um `LEIAME.txt` com os nomes exatos de arquivo esperados por cada card. Adicione as fotos com esses nomes e elas substituem automaticamente as ilustrações.
