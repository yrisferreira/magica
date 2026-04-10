# magica

Pequeno site estático (HTML/CSS/JS) para partilhar.

## Link público (GitHub Pages)

Depois de ativares o Pages uma vez no GitHub, o endereço fica:

**https://yrisferreira.github.io/magica/**

### Ativar pela primeira vez

1. Abre o repositório no GitHub → **Settings** → **Pages** (menu lateral).
2. Em **Build and deployment**, em **Source**, escolhe **GitHub Actions**.
3. Volta a **Actions** e confirma que o workflow **Deploy GitHub Pages** correu com sucesso (ou faz um push vazio para disparar).

Os próximos pushes na branch `main` atualizam o site sozinhos.

## Correr em local

Na pasta do projeto:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`.
