# Modelo 07 — Barbearia · On Track LP

Landing page modelo da **On Track**, feita em **Nuxt 4** (Vue). Sem marca: pronta para personalizar e vender.

- **Demonstração:** https://devagenciaontrack-sys.github.io/lp-modelo-07-ontrack/

## O que tem
- Topo com poste de barbeiro animado e status **aberto agora / fechado** calculado pelo horário de funcionamento.
- **Tabela da casa** que monta o atendimento: o cliente marca os serviços, vê total, tempo na cadeira e desconto do combo corte + barba, escolhe dia, período e barbeiro, e o pedido vai pronto para o WhatsApp.
- Barbeiros por cadeira, **clube de assinatura** (cartão de sócio), sobre nós com mimos da casa, avaliações, endereço e horários com o dia de hoje destacado.

## Como personalizar
Tudo fica no topo de `app/app.vue`:
- `site`: nome, ano de abertura, WhatsApp, Instagram, endereço, link do mapa, CNPJ, nota do Google.
- `horario`: horário de cada dia da semana (0 = domingo; `null` = fechado). O status e os dias disponíveis no agendamento usam isso.
- `servicos` (preço e minutos), `combo` (desconto corte + barba), `barbeiros`, `planos`, `depoimentos`.
- Cores e fontes: topo de `app/assets/css/main.css` e `nuxt.config.ts`.
- Fotos: `public/fotos/`. As atuais são de ambientação (Wikimedia Commons), com crédito no rodapé; ao trocar por fotos próprias, apague o crédito. Os espaços "Foto do barbeiro" recebem a foto de cada um.

## Rodar e publicar
```
npm install
npm run dev        # http://localhost:3000
npm run generate   # site estático em .output/public
```
- **Vercel:** importe o repositório; a Vercel detecta o Nuxt sozinha. Não defina `LP_BASE`.
- **GitHub Pages (demonstração):** `LP_BASE=/lp-modelo-07-ontrack/ npm run generate` e publique `.output/public` no branch `gh-pages`.

## Briefing para o cliente
PDF com tudo o que precisamos do cliente para montar o site: [baixar o briefing](Briefing-Modelo-07-Barbearia.pdf?raw=1)
