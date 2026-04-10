# magica

Site estático (HTML, CSS, JS) para partilhar.

## Link público (GitHub Pages)

**https://yrisferreira.github.io/magica/**

Este repositório usa a forma **mais simples** de Pages: publicar **diretamente da branch `main`**, sem GitHub Actions.

### Ativar o GitHub Pages (passo a passo)

1. Garante que o código está no GitHub na branch **`main`** e que na **raiz** do repositório existem `index.html`, `style.css` e `script.js` (como neste projeto).

2. No GitHub, abre o repositório **magica** → **Settings** (Definições).

3. No menu lateral, clica em **Pages**.

4. Em **Build and deployment**:
   - **Source** (Origem): escolhe **Deploy from a branch** (Publicar a partir de um branch).  
     Não escolhas “GitHub Actions” a menos que tenhas um workflow configurado.

5. Em **Branch**:
   - Branch: **`main`**
   - Pasta: **`/ (root)`**
   - Clica **Save**.

6. Espera **1 a 3 minutos**. Atualiza a página de Settings do Pages: deve aparecer uma mensagem verde do tipo “Your site is live at …”.

7. Abre o link: `https://yrisferreira.github.io/magica/`  
   Se ainda der 404, espera mais um pouco ou experimenta em janela privada (cache).

### Se algo correr mal

| Problema | O que fazer |
|----------|-------------|
| Só vejo “404” | Confirma que **Source** é **Deploy from a branch** → `main` → `/ (root)`. Espera 5 minutos. |
| Estava em “GitHub Actions” e falhava | Muda para **Deploy from a branch** como acima. |
| Repositório **privado** | Nas contas gratuitas, GitHub Pages em repo privado pode ter limitações; torna o repo **público** temporariamente para testar, ou verifica [documentação Pages](https://docs.github.com/pages). |
| Ficheiros noutra pasta | O `index.html` tem de estar na **raiz** (ou escolhe a pasta `/docs` no menu e mete os ficheiros lá). |

## Partilhar com alguém (sem depender do GitHub Pages)

Se o Pages não funcionar, estas opções dão um **link** ou um **ficheiro** que a outra pessoa abre e **usa como no site** (cliques, som, cartas).

### 1) Um só ficheiro: `magica-standalone.html`

Na pasta do projeto existe **`magica-standalone.html`** com HTML, CSS e JS juntos.

- **No computador:** envia por e-mail / WhatsApp / Telegram → a pessoa **descarrega** e abre com **duplo clique** (Chrome, Safari, Edge).
- **No telemóvel:** também funciona muitas vezes ao abrir o ficheiro descarregado no browser; se o gestor de ficheiros não abrir bem, usa a opção 2 ou 3 abaixo.

*(Precisa de internet só para carregar as fontes do Google; o resto corre localmente.)*

### 2) Netlify Drop (link em ~1 minuto, sem Git)

1. Abre **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Arrasta para a janela **toda a pasta** do site (com `index.html`, `style.css`, `script.js`) **ou** só o ficheiro `magica-standalone.html`.
3. O Netlify mostra um **link** tipo `https://algo-random.netlify.app` — copia e envia.

Conta no Netlify é opcional para experimentar; para não perderes o link, podes criar login grátis.

### 3) Cloudflare Pages ou Vercel

- **Cloudflare Pages:** [pages.cloudflare.com](https://pages.cloudflare.com) — projeto estático, upload ou ligação ao Git.
- **Vercel:** [vercel.com](https://vercel.com) — “Add New Project”, arrastar pasta ou Git.

### 4) ZIP pela Drive / iCloud

Comprime `index.html`, `style.css` e `script.js` (ou só `magica-standalone.html`) num **.zip**, partilha no Drive e a pessoa descarrega e abre o HTML **no computador**. No telemóvel é mais simples usar Netlify Drop com o mesmo ZIP (ou o HTML único).

## Correr em local

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`.
