# xore.rocks — personal homepage

Personal landing page: animated particle background, typewriter hero, project cards,
a fake-terminal stack overview, and a live uptime counter. Pure HTML/CSS/JS — no
frameworks, no build step, no CDN dependencies.

## Layout

```
.
├── docker-compose.yml   # nginx + socat bridge, home-server stack
├── nginx.conf           # nginx site config
└── html/
    ├── index.html
    ├── style.css
    └── app.js
```

## Deploy

Runs behind the CGNAT tunnel described in [Xore/cgnat](https://github.com/Xore/cgnat) —
this repo has no networking of its own beyond a local nginx + socat bridge.

```bash
docker compose up -d
curl http://127.0.0.1:8081
curl http://127.0.0.1:8081/health
docker logs nginx-homepage -f
```

Then wire it into the VPS side of the tunnel (Traefik router + socat bridge) per
[Xore/cgnat](https://github.com/Xore/cgnat)'s VPS setup docs, and point DNS at the VPS.

## Customising

| What | Where in `html/index.html` |
|------|----------------------------|
| Typewriter lines | `const lines = [...]` in the typewriter hero script block |
| Uptime counter | `const start = Date.now() - (N * 86400 ...)` — adjust the day count |
| Project cards | `.project-card` blocks in the Projects section |
| Stack items | `.stack-item` blocks in the Currently Running section |
| Terminal output | `.terminal-body` — edit the fake `docker ps` lines |
| Stats | `.stat-num` spans in the About section |
| Links | `footer-links` / `project-link` anchors |

## Related

- [Xore/cgnat](https://github.com/Xore/cgnat) — the WireGuard/CGNAT tunnel and VPS reverse-proxy setup this site runs behind
- [Xore/auth-backend](https://github.com/Xore/auth-backend) — SSO/forward-auth portal for other services on the same tunnel (not used by this site)
