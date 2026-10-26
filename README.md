# fakerdoeslinux.github.io

A minimal, dependency-free project site for the FakerDoesLinux GitHub repos.
Black base, navy surfaces, one blue accent — GitHub's information architecture
with a quieter, Apple/Google-ish finish.

No build step, no frameworks, no external requests. The avatar is bundled, and
the project data is baked in, so the site works offline and on a local network.

## Run it locally

```sh
./serve.sh
```

It binds to `0.0.0.0:8080` and prints every address it can be reached at:

- **This machine** — http://localhost:8080
- **Other devices on the same network** — `http://<your-lan-ip>:8080`

Anyone on your network can open the network URL while the server is running.
The site is only exposed to the wider internet if you publish it or forward the
port yourself.

On Fedora, if another device cannot connect, allow the port once:

```sh
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

Pick a different port with `./serve.sh 9000`.

## Publish to GitHub Pages

Sign in to the account that should own the site (for the address
`https://fakerdoeslinux.github.io`, that is `fakerdoeslinux`):

```sh
gh auth login
./publish.sh
```

The script creates `<account>.github.io` if it does not exist, pushes `main`,
and enables Pages. Publishing takes a minute the first time.

Manual equivalent:

```sh
git init -b main
git add -A
git commit -m "Publish project site"
gh repo create fakerdoeslinux.github.io --public --source=. --remote=origin --push
```

Then in the repository: **Settings → Pages → Build and deployment → Deploy from
a branch → `main` / `/ (root)`**.

If you prefer to use an existing repository, pass its name:
`./publish.sh my-site`. A project site is served from
`https://<account>.github.io/my-site/`, and the relative links still work.

## Editing the site

| What | Where |
| --- | --- |
| Project copy, tags, install commands, stars | `assets/data.js` |
| Colors, spacing, type scale | `assets/styles.css` (tokens at the top) |
| Markup and pinned order | `index.html` + `assets/data.js` |
| Avatar | `assets/avatar.jpg` |
| Favicon | `assets/favicon.svg` |

`assets/data.js` is a plain array. The pinned grid follows its order; the
repository list sorts by `pushedAt` automatically. Dates shown as relative
("2 days ago") are computed at load time, so they stay accurate.

Update `stars`, `forks`, and `pushedAt` by hand when a repo changes. This is
deliberate: no runtime calls to the GitHub API means no rate limits and no
broken cards when the network is down.

## Structure

```
.
├── index.html          # the whole site
├── 404.html            # GitHub Pages not-found page
├── assets/
│   ├── styles.css      # BlackOnBlue theme
│   ├── data.js         # project content
│   ├── app.js          # rendering, search, filters, dialogs
│   ├── avatar.jpg
│   └── favicon.svg
├── serve.sh            # local server on 0.0.0.0:8080
├── publish.sh          # GitHub Pages deploy helper
└── .nojekyll           # serve files as-is on Pages
```

## Notes

- Search and language filters work on name, description, tags, and language.
- Every card opens an overview with highlights, install/play instructions, and
  copy buttons. `Esc` or a click outside closes it.
- The Veltris game lives on the `fakerhog15` account; its links point there.
- License: the site code is yours to use. Project names and descriptions belong
  to their respective repositories.
