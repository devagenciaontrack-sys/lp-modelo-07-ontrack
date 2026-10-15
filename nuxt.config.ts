// Modelo 07 · Barbearia — On Track LP
// Endereço público do site (usado na prévia do WhatsApp/Instagram). Em domínio próprio: LP_URL=https://www.cliente.com.br/
const SITE = process.env.LP_URL || 'https://devagenciaontrack-sys.github.io/lp-modelo-07-ontrack/'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    // GitHub Pages: LP_BASE=/<repo>/ · Vercel/domínio próprio: deixe vazio
    baseURL: process.env.LP_BASE || '/',
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Sua Barbearia — A arte do corte bem feito',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Corte masculino, barba na toalha quente e navalha, sobrancelha e pigmentação. Monte seu atendimento e agende pelo WhatsApp.' },
        { name: 'theme-color', content: '#0B0A09' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Sua Barbearia — A arte do corte bem feito' },
        { property: 'og:description', content: 'Corte masculino, barba na toalha quente e navalha, sobrancelha e pigmentação. Monte seu atendimento e agende pelo WhatsApp.' },
        { property: 'og:url', content: SITE },
        { property: 'og:image', content: SITE + 'og.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap' },
        { rel: 'icon', href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%230B0A09'/%3E%3Ccircle cx='32' cy='32' r='26' fill='none' stroke='%23C9A45C' stroke-width='2'/%3E%3Ctext x='32' y='41' font-family='Georgia' font-style='italic' font-size='24' text-anchor='middle' fill='%23C9A45C'%3ESB%3C/text%3E%3C/svg%3E" },
      ],
    },
  },
})
