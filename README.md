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

## Correr em local

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`.
