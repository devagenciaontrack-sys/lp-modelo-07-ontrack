<script setup lang="ts">
// ============ PERSONALIZAÇÃO ============
const site = {
  marca: 'Sua Barbearia',
  desde: '2012',
  whatsapp: '5500000000000',
  instagram: '#',
  endereco: 'Av. Paulista, 1000 — Bela Vista, São Paulo/SP', // troque pelo endereço real (o mapa usa este texto)
  estacionamento: 'Estacionamento conveniado ao lado, com 1h grátis',
  cnpj: '00.000.000/0000-00',
  notaGoogle: '4,9',
  avaliacoesGoogle: '000',
}
// horário por dia da semana (0 = domingo). null = fechado
const horario: Record<number, [number, number] | null> = { 0: null, 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 21], 5: [9, 21], 6: [8, 18] }
const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
// serviços: preço em reais e duração em minutos
const servicos = [
  { id: 'corte', n: 'Corte', d: 'Tesoura ou máquina, lavagem e finalização', p: 60, min: 45 },
  { id: 'barba', n: 'Barba', d: 'Toalha quente, navalha e balm', p: 45, min: 30 },
  { id: 'pezinho', n: 'Acabamento', d: 'Pezinho e contorno entre um corte e outro', p: 25, min: 15 },
  { id: 'sobrancelha', n: 'Sobrancelha', d: 'Na navalha', p: 20, min: 10 },
  { id: 'pigmentacao', n: 'Pigmentação de barba', d: 'Disfarça falhas com acabamento natural', p: 40, min: 20 },
  { id: 'hidratacao', n: 'Hidratação', d: 'Cabelo ou barba, com massagem', p: 35, min: 20 },
  { id: 'infantil', n: 'Corte infantil', d: 'Até 12 anos', p: 45, min: 30 },
]
const combo = 15 // desconto quando corte + barba são escolhidos juntos
const galeria = [
  { src: 'corte-1.webp', w: 1200, h: 794, t: 'Degradê com desenho' },
  { src: 'corte-3.webp', w: 1002, h: 1600, t: 'Risco na navalha' },
  { src: 'corte-2.webp', w: 1024, h: 1280, t: 'Degradê médio' },
  { src: 'barba.webp', w: 1400, h: 645, t: 'Acabamento no espelho' },
  { src: 'corte-4.webp', w: 1200, h: 787, t: 'Low fade' },
  { src: 'navalha.webp', w: 1000, h: 1304, t: 'Barba na navalha' },
]
const barbeiros = [
  { n: 'Rafael', d: 'Degradês e cortes na tesoura', anos: 12 },
  { n: 'Thiago', d: 'Barba desenhada e toalha quente', anos: 8 },
  { n: 'Bruno', d: 'Cortes clássicos e infantis', anos: 6 },
]
const planos = [
  { n: 'Clube Corte', p: 129, itens: ['Cortes ilimitados no mês', 'Acabamento sempre que precisar', 'Agenda com prioridade'] },
  { n: 'Clube Completo', p: 199, itens: ['Cortes e barbas ilimitados', 'Sobrancelha e hidratação inclusas', 'Uma bebida por visita'] },
]
const depoimentos = [
  { t: 'Atendimento no horário, ambiente impecável e um degradê que dura. Virei cliente fixo.', n: 'Lucas M.' },
  { t: 'A barba na toalha quente é outro nível. Dá para sentir o cuidado em cada detalhe.', n: 'Fernando A.' },
  { t: 'Levo meu filho desde pequeno. Paciência e capricho de sobra.', n: 'Carla S.' },
]
const faq = [
  { q: 'Preciso agendar ou posso chegar?', a: 'Atendemos por agendamento para ninguém esperar. Se houver horário livre, encaixamos quem chegar; vale chamar no WhatsApp antes.' },
  { q: 'E se eu me atrasar?', a: 'Seguramos o horário por até 15 minutos. Depois disso, reagendamos para não atrasar quem vem em seguida.' },
  { q: 'Quais formas de pagamento vocês aceitam?', a: 'Pix, cartão de débito e crédito e dinheiro. O clube é cobrado todo mês no cartão.' },
  { q: 'Como funciona o clube?', a: 'Você paga uma mensalidade e vem quantas vezes quiser, de segunda a sexta. Cancela quando quiser, sem multa.' },
  { q: 'Vocês atendem crianças?', a: 'Sim, a partir de 2 anos, com um barbeiro que tem paciência de sobra.' },
]

// ============ STATUS AO VIVO ============
const status = ref<{ aberto: boolean, texto: string } | null>(null)
const hojeIdx = ref<number | null>(null)
function calcularStatus() {
  const agora = new Date()
  const d = agora.getDay()
  hojeIdx.value = d
  const h = agora.getHours() + agora.getMinutes() / 60
  const hj = horario[d]
  if (hj && h >= hj[0] && h < hj[1]) { status.value = { aberto: true, texto: `Aberto agora · até as ${hj[1]}h` }; return }
  for (let i = hj && h < hj[0] ? 0 : 1; i <= 7; i++) {
    const dd = (d + i) % 7, hh = horario[dd]
    if (!hh) continue
    const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : nomesDias[dd].toLowerCase()
    status.value = { aberto: false, texto: `Fechado agora · abre ${quando} às ${hh[0]}h` }
    return
  }
}

// ============ MONTE SEU ATENDIMENTO ============
const escolhidos = ref<string[]>(['corte'])
const temCombo = computed(() => escolhidos.value.includes('corte') && escolhidos.value.includes('barba'))
const total = computed(() => servicos.filter(s => escolhidos.value.includes(s.id)).reduce((t, s) => t + s.p, 0) - (temCombo.value ? combo : 0))
const minutos = computed(() => servicos.filter(s => escolhidos.value.includes(s.id)).reduce((t, s) => t + s.min, 0))
const duracao = computed(() => minutos.value >= 60 ? `${Math.floor(minutos.value / 60)}h${minutos.value % 60 ? String(minutos.value % 60).padStart(2, '0') : ''}` : `${minutos.value} min`)
const dias = ref<{ id: string, rotulo: string }[]>([])
const dia = ref('')
const periodo = ref('Tarde')
const barbeiro = ref('Tanto faz')
function montarDias() {
  const out: { id: string, rotulo: string }[] = []
  const base = new Date()
  const hora = base.getHours() + base.getMinutes() / 60
  for (let i = 0; out.length < 5 && i < 10; i++) {
    const dt = new Date(base); dt.setDate(base.getDate() + i)
    const hh = horario[dt.getDay()]
    if (!hh) continue
    if (i === 0 && hora >= hh[1] - 0.5) continue // hoje já fechou (ou fecha em menos de meia hora)
    const rot = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : `${nomesDias[dt.getDay()].slice(0, 3)} ${dt.getDate()}`
    out.push({ id: `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`, rotulo: rot })
  }
  dias.value = out
  dia.value = out[0]?.id || ''
}
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const agendar = computed(() => {
  const nomes = servicos.filter(s => escolhidos.value.includes(s.id)).map(s => s.n).join(', ')
  const d = dias.value.find(x => x.id === dia.value)?.rotulo || ''
  const msg = `Olá! Quero agendar: ${nomes || 'um horário'}. Dia: ${d.toLowerCase()}, período: ${periodo.value.toLowerCase()}. Barbeiro: ${barbeiro.value}.`
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`
})
const wa = (t = 'Olá! Quero agendar um horário.') => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t)}`
const mapa = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(site.endereco)}&output=embed`)
const rota = computed(() => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.endereco)}`)
const iniciais = site.marca.split(' ').map(p => p[0]).join('').slice(0, 2)
const base = useRuntimeConfig().app.baseURL
const aberta = ref(0)
function agendarCom(n: string) {
  barbeiro.value = n
  document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => { calcularStatus(); montarDias() })
</script>

<template>
  <div>
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.4Z" /></symbol>
        <symbol id="i-ig" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /></g><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></g></symbol>
        <symbol id="i-carro" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-3l2-5h12l2 5v3Z" /><circle cx="7.5" cy="16.5" r="1.6" /><circle cx="16.5" cy="16.5" r="1.6" /></g></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></symbol>
        <symbol id="i-estrela" viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" fill="currentColor" /></symbol>
        <symbol id="i-navalha" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 30 30 12c3-2 7-1 8 2l-26 20Z" /><path d="M12 34 8 42M30 12l6-4 4 4" /></g></symbol>
      </defs>
    </svg>

    <header class="topo">
      <div class="wrap topo-in">
        <a href="#" class="marca"><span class="monograma" aria-hidden="true">{{ iniciais }}</span><span>{{ site.marca }}</span></a>
        <nav class="nav" aria-label="Seções"><a href="#servicos">Serviços</a><a href="#trabalho">Nosso trabalho</a><a href="#clube">Clube</a><a href="#sobre">Sobre nós</a><a href="#visite">Visite</a></nav>
        <a class="btn btn-contorno btn-p" href="#servicos">Agendar</a>
      </div>
    </header>

    <main id="conteudo">
      <!-- topo -->
      <section class="hero">
        <img class="hero-foto" :src="`${base}fotos/hero.webp`" width="1920" height="885" alt="Cliente na cadeira da barbearia, de costas, diante do espelho iluminado" fetchpriority="high">
        <div class="wrap hero-in">
          <p class="selo"><span class="filete" aria-hidden="true" />Barbearia desde {{ site.desde }}</p>
          <h1>A arte do corte bem feito.</h1>
          <p class="hero-desc">Corte, barba na toalha quente e navalha afiada, com hora marcada e um ambiente feito para você não ter pressa de ir embora.</p>
          <div class="hero-acoes">
            <a class="btn btn-ouro" href="#servicos">Agendar horário</a>
            <a class="btn btn-contorno" :href="wa()" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>WhatsApp</a>
          </div>
          <p v-if="status" class="status" :class="{ aberto: status.aberto }"><i />{{ status.texto }}</p>
        </div>
        <ul class="hero-pilares wrap" aria-label="Diferenciais">
          <li><b>Toalha quente</b><span>em toda barba</span></li>
          <li><b>Navalha</b><span>lâmina nova a cada cliente</span></li>
          <li><b>Hora marcada</b><span>respeitada de verdade</span></li>
          <li><b>{{ site.notaGoogle }} no Google</b><span>{{ site.avaliacoesGoogle }} avaliações</span></li>
        </ul>
      </section>

      <!-- serviços e valores + montar atendimento -->
      <section id="servicos" class="servicos">
        <div class="wrap">
          <div class="sec-titulo">
            <h2>Serviços e valores</h2>
            <p>Marque o que você quer fazer e veja o total na hora. Corte e barba juntos saem {{ brl(combo) }} mais em conta.</p>
          </div>
          <div class="serv-grid">
            <ul class="menu">
              <li v-for="s in servicos" :key="s.id">
                <label :class="{ on: escolhidos.includes(s.id) }">
                  <input v-model="escolhidos" type="checkbox" :value="s.id">
                  <span class="caixa" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span class="item"><b>{{ s.n }}</b><small>{{ s.d }} · {{ s.min }} min</small></span>
                  <span class="pontos" aria-hidden="true" />
                  <span class="preco">{{ brl(s.p) }}</span>
                </label>
              </li>
            </ul>

            <aside class="ficha" aria-live="polite">
              <p class="ficha-tit">Seu atendimento</p>
              <p v-if="!escolhidos.length" class="vazio">Marque pelo menos um serviço.</p>
              <template v-else>
                <p class="total">{{ brl(total) }}</p>
                <p class="dur">{{ duracao }} na cadeira</p>
                <p v-if="temCombo" class="combo">Combo corte + barba: {{ brl(combo) }} a menos</p>
              </template>
              <fieldset>
                <legend>Dia</legend>
                <div class="chips"><button v-for="d in dias" :key="d.id" type="button" :class="{ on: dia === d.id }" :aria-pressed="dia === d.id" @click="dia = d.id">{{ d.rotulo }}</button></div>
              </fieldset>
              <fieldset>
                <legend>Período</legend>
                <div class="chips"><button v-for="p in ['Manhã', 'Tarde', 'Noite']" :key="p" type="button" :class="{ on: periodo === p }" :aria-pressed="periodo === p" @click="periodo = p">{{ p }}</button></div>
              </fieldset>
              <fieldset>
                <legend>Barbeiro</legend>
                <div class="chips"><button v-for="b in ['Tanto faz', ...barbeiros.map(x => x.n)]" :key="b" type="button" :class="{ on: barbeiro === b }" :aria-pressed="barbeiro === b" @click="barbeiro = b">{{ b }}</button></div>
              </fieldset>
              <a class="btn btn-ouro btn-cheio" :class="{ off: !escolhidos.length }" :href="agendar" target="_blank" rel="noopener" :aria-disabled="!escolhidos.length"><svg><use href="#i-wa" /></svg>Pedir horário</a>
              <p class="nota">Respondemos com os horários livres para você confirmar.</p>
            </aside>
          </div>
        </div>
      </section>

      <!-- nosso trabalho -->
      <section id="trabalho" class="trabalho">
        <div class="wrap">
          <div class="sec-titulo sec-titulo-linha">
            <h2>Nosso trabalho</h2>
            <a class="link" :href="site.instagram" target="_blank" rel="noopener"><svg><use href="#i-ig" /></svg>Mais cortes no Instagram</a>
          </div>
          <div class="galeria">
            <figure v-for="(g, i) in galeria" :key="g.src" :class="`g${i + 1}`">
              <img :src="`${base}fotos/${g.src}`" :width="g.w" :height="g.h" :alt="g.t" loading="lazy">
              <figcaption>{{ g.t }}</figcaption>
            </figure>
          </div>
          <p class="aviso">Fotos de exemplo: substitua pelos cortes feitos na casa.</p>
        </div>
      </section>

      <!-- barbeiros -->
      <section class="barbeiros">
        <div class="wrap">
          <div class="sec-titulo"><h2>Os barbeiros</h2></div>
          <div class="equipe">
            <article v-for="b in barbeiros" :key="b.n" class="barbeiro">
              <div class="retrato"><span class="inicial" aria-hidden="true">{{ b.n[0] }}</span><span class="aviso-foto">Foto do barbeiro</span></div>
              <h3>{{ b.n }}</h3>
              <p>{{ b.d }}</p>
              <p class="anos">{{ b.anos }} anos de profissão</p>
              <button type="button" class="link" @click="agendarCom(b.n)">Agendar com o {{ b.n }}</button>
            </article>
          </div>
        </div>
      </section>

      <!-- clube -->
      <section id="clube" class="clube">
        <div class="wrap clube-grid">
          <div class="clube-txt">
            <h2>O clube da casa</h2>
            <p>Para quem gosta de estar sempre alinhado. Uma mensalidade e você vem quantas vezes quiser, de segunda a sexta. Cancele quando quiser.</p>
          </div>
          <div class="cartoes">
            <article v-for="(p, i) in planos" :key="p.n" class="cartao" :class="{ ouro: i === 1 }">
              <div class="cartao-topo"><span class="monograma" aria-hidden="true">{{ iniciais }}</span><span>Membro</span></div>
              <h3>{{ p.n }}</h3>
              <p class="cartao-preco"><b>{{ brl(p.p) }}</b> por mês</p>
              <ul><li v-for="it in p.itens" :key="it">{{ it }}</li></ul>
              <a class="btn" :class="i === 1 ? 'btn-preto' : 'btn-contorno'" :href="wa(`Olá! Quero entrar no ${p.n}.`)" target="_blank" rel="noopener">Quero ser membro</a>
            </article>
          </div>
        </div>
      </section>

      <!-- sobre nós -->
      <!-- TODO: trocar pela história real e pelas fotos do espaço -->
      <section id="sobre" class="sobre">
        <div class="wrap sobre-grid">
          <img :src="`${base}fotos/ritual.webp`" width="1400" height="1447" alt="Barbeiro finalizando o atendimento diante do espelho" loading="lazy" class="sobre-foto">
          <div class="sobre-txt">
            <h2>Sobre nós</h2>
            <p>A {{ site.marca }} abriu em {{ site.desde }} com uma cadeira e uma ideia simples: tratar cada cliente como se fosse o único do dia. Hoje somos três barbeiros, mas o cuidado continua o mesmo.</p>
            <p>Aqui o corte não tem pressa. Tem conversa, café passado na hora e atenção ao detalhe que faz diferença no espelho.</p>
            <ul class="mimos">
              <li>Café, água e chope por conta da casa</li>
              <li>Toalhas lavadas e lâmina nova a cada cliente</li>
              <li>Wi-Fi, ar-condicionado e futebol na TV</li>
              <li>Produtos profissionais à venda</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- avaliações -->
      <section class="avaliacoes">
        <div class="wrap">
          <div class="nota">
            <span class="estrelas" aria-hidden="true"><svg v-for="k in 5" :key="k"><use href="#i-estrela" /></svg></span>
            <p><b>{{ site.notaGoogle }}</b> de 5 no Google · {{ site.avaliacoesGoogle }} avaliações</p>
          </div>
          <div class="deps">
            <figure v-for="d in depoimentos" :key="d.n"><blockquote>“{{ d.t }}”</blockquote><figcaption>{{ d.n }}</figcaption></figure>
          </div>
          <p class="aviso">Avaliações de exemplo: substitua pelas avaliações reais do Google.</p>
        </div>
      </section>

      <!-- visite -->
      <section id="visite" class="visite">
        <div class="wrap">
          <div class="sec-titulo"><h2>Visite a casa</h2></div>
          <div class="visite-card">
            <div class="mapa">
              <iframe :src="mapa" title="Mapa com a localização da barbearia" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
            </div>
            <div class="visite-info">
              <p v-if="status" class="status" :class="{ aberto: status.aberto }"><i />{{ status.texto }}</p>
              <p class="info"><svg><use href="#i-pin" /></svg><span>{{ site.endereco }}</span></p>
              <p class="info"><svg><use href="#i-carro" /></svg><span>{{ site.estacionamento }}</span></p>
              <ul class="horarios" aria-label="Horário de funcionamento">
                <li v-for="i in [1, 2, 3, 4, 5, 6, 0]" :key="i" :class="{ hoje: hojeIdx === i }">
                  <span>{{ nomesDias[i] }}<em v-if="hojeIdx === i"> · hoje</em></span>
                  <span>{{ horario[i] ? `${horario[i]![0]}h — ${horario[i]![1]}h` : 'Fechado' }}</span>
                </li>
              </ul>
              <div class="visite-acoes">
                <a class="btn btn-ouro" :href="rota" target="_blank" rel="noopener">Como chegar</a>
                <a class="btn btn-contorno" :href="wa()" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- dúvidas -->
      <section class="duvidas">
        <div class="wrap duv-grid">
          <div class="duv-lado">
            <svg class="duv-navalha" aria-hidden="true"><use href="#i-navalha" /></svg>
            <h2>Antes de sentar na cadeira</h2>
            <p>As perguntas que mais ouvimos no balcão. Ficou outra dúvida? Fale com a gente.</p>
            <a class="link" :href="wa('Olá! Tenho uma dúvida.')" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>Perguntar no WhatsApp</a>
          </div>
          <ol class="duv-lista">
            <li v-for="(f, i) in faq" :key="f.q" :class="{ on: aberta === i }">
              <button type="button" :aria-expanded="aberta === i" :aria-controls="`resp-${i}`" @click="aberta = aberta === i ? -1 : i">
                <span class="duv-n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="duv-q">{{ f.q }}</span>
                <span class="duv-sinal" aria-hidden="true" />
              </button>
              <div :id="`resp-${i}`" class="duv-r" role="region"><div><p>{{ f.a }}</p></div></div>
            </li>
          </ol>
        </div>
      </section>
    </main>

    <footer class="rodape">
      <div class="wrap rod-top">
        <a href="#" class="marca"><span class="monograma" aria-hidden="true">{{ iniciais }}</span><span>{{ site.marca }}</span></a>
        <p>{{ site.endereco }}<br>CNPJ {{ site.cnpj }}</p>
        <div class="rod-redes">
          <a :href="wa()" target="_blank" rel="noopener" aria-label="WhatsApp"><svg><use href="#i-wa" /></svg></a>
          <a :href="site.instagram" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-ig" /></svg></a>
        </div>
      </div>
      <div class="wrap"><div class="rod-final">
        <span>© {{ new Date().getFullYear() }} {{ site.marca }}. Fotos de ambientação: Classic Barbers, Alvinategyeka e Frank Schulenburg, via Wikimedia Commons (CC0 e CC BY-SA 3.0).</span>
        <a class="rod-credito" href="https://www.ontrackagenciadigital.com.br/" target="_blank" rel="noopener">Desenvolvido por <b>OnTrack Agência Digital</b></a>
      </div></div>
    </footer>
  </div>
</template>
