// Modelo 07 · Barbearia — On Track LP
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    // GitHub Pages: LP_BASE=/<repo>/ · Vercel/domínio próprio: deixe vazio
    baseURL: process.env.LP_BASE || '/',
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Sua Barbearia — Corte, barba e conversa boa',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Corte masculino, barba na toalha quente e navalha, sobrancelha e pigmentação. Monte seu atendimento e agende pelo WhatsApp.' },
        { name: 'theme-color', content: '#10261C' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Figtree:wght@400;500;600;700&display=swap' },
        { rel: 'icon', href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2310261C'/%3E%3Crect x='24' y='8' width='16' height='48' rx='4' fill='%23EFE7D6'/%3E%3Cpath d='M24 18 40 10v8L24 26ZM24 34l16-8v8l-16 8ZM24 50l16-8v8l-8 4h-8Z' fill='%23B3261E'/%3E%3C/svg%3E" },
      ],
    },
  },
})
