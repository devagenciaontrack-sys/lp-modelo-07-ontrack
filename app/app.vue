<script setup lang="ts">
// ============ PERSONALIZAÇÃO ============
const site = {
  marca: 'Sua Barbearia',
  desde: '2012',
  whatsapp: '5500000000000',
  instagram: '#',
  endereco: 'Rua Exemplo, 000 — Centro, Sua cidade/UF',
  mapa: 'https://maps.google.com/?q=Rua+Exemplo+000',
  estacionamento: 'Estacionamento conveniado na esquina',
  cnpj: '00.000.000/0000-00',
  notaGoogle: '4,9',
  avaliacoesGoogle: '000',
}
// horário por dia da semana (0 = domingo). null = fechado
const horario: Record<number, [number, number] | null> = { 0: null, 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 21], 5: [9, 21], 6: [8, 18] }
const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
// serviços: preço em reais e duração em minutos
const servicos = [
  { id: 'corte', n: 'Corte', d: 'Tesoura ou máquina, lavagem e finalização', p: 45, min: 40 },
  { id: 'barba', n: 'Barba', d: 'Toalha quente, navalha e balm', p: 35, min: 30 },
  { id: 'pezinho', n: 'Pezinho', d: 'Acabamento entre um corte e outro', p: 15, min: 15 },
  { id: 'sobrancelha', n: 'Sobrancelha', d: 'Na navalha ou na pinça', p: 15, min: 10 },
  { id: 'pigmentacao', n: 'Pigmentação de barba', d: 'Disfarça falhas, dura até 3 dias', p: 30, min: 20 },
  { id: 'infantil', n: 'Corte infantil', d: 'Até 12 anos, com paciência', p: 35, min: 30 },
  { id: 'platinado', n: 'Platinado', d: 'Descoloração e matização', p: 120, min: 120 },
]
const combo = 10 // desconto quando corte + barba são escolhidos juntos
const barbeiros = [
  { cadeira: 1, n: 'Rafael', d: 'Degradê e navalhado. Doze anos de tesoura.' },
  { cadeira: 2, n: 'Thiago', d: 'Barba desenhada e toalha quente.' },
  { cadeira: 3, n: 'Bruno', d: 'Social, infantil e platinado.' },
]
const planos = [
  { n: 'Clube Corte', p: 99, itens: ['Cortes ilimitados no mês', 'Pezinho sempre que precisar', 'Agenda com prioridade'] },
  { n: 'Clube Completo', p: 149, itens: ['Cortes e barbas ilimitados', 'Sobrancelha inclusa', 'Um chope por visita'] },
]
const depoimentos = [
  { t: 'Saio daqui sempre com o degradê certinho. E o café é bom de verdade.', n: 'Lucas M.' },
  { t: 'Barba na toalha quente que vale a viagem. Atendimento no horário marcado.', n: 'Fernando A.' },
  { t: 'Levo meu filho desde os quatro anos. O Bruno tem uma paciência enorme.', n: 'Carla S.' },
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
  if (hj && h >= hj[0] && h < hj[1]) { status.value = { aberto: true, texto: `Aberto agora, até as ${hj[1]}h` }; return }
  for (let i = hj && h < hj[0] ? 0 : 1; i <= 7; i++) {
    const dd = (d + i) % 7, hh = horario[dd]
    if (!hh) continue
    const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : nomesDias[dd].toLowerCase()
    status.value = { aberto: false, texto: `Fechado agora, abre ${quando} às ${hh[0]}h` }
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
const base = useRuntimeConfig().app.baseURL

function agendarCom(n: string) {
  barbeiro.value = n
  document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => { calcularStatus(); montarDias() })
</script>

<template>
  <div>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.4Z" /></symbol>
        <symbol id="i-ig" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /></g><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></g></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></symbol>
      </defs>
    </svg>

    <header class="topo">
      <div class="wrap topo-in">
        <a href="#" class="marca"><span class="poste-mini" aria-hidden="true" />{{ site.marca }}</a>
        <nav class="nav" aria-label="Seções"><a href="#precos">Preços</a><a href="#barbeiros">Barbeiros</a><a href="#clube">Clube</a><a href="#sobre">Sobre nós</a><a href="#onde">Onde estamos</a></nav>
        <a class="btn btn-vermelho btn-p" href="#precos">Agendar</a>
      </div>
    </header>

    <main>
      <!-- topo -->
      <section class="hero">
        <div class="poste" aria-hidden="true"><span class="poste-cap" /><span class="poste-vidro"><span class="poste-listras" /></span><span class="poste-cap" /></div>
        <div class="wrap hero-grid">
          <div class="hero-txt">
            <p v-if="status" class="status" :class="{ aberto: status.aberto }"><i />{{ status.texto }}</p>
            <p v-else class="status"><i />Confira o horário de hoje</p>
            <h1>Corte, barba e conversa boa.</h1>
            <p class="hero-desc">Barbearia de bairro desde {{ site.desde }}. Toalha quente, navalha afiada, café passado na hora e horário marcado que é respeitado.</p>
            <div class="hero-acoes">
              <a class="btn btn-vermelho" href="#precos">Montar meu atendimento</a>
              <a class="btn btn-linha" :href="wa()" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>Chamar no WhatsApp</a>
            </div>
          </div>
          <figure class="vitrine">
            <img :src="`${base}fotos/barba.webp`" width="1100" height="878" alt="Barbeiro aparando a barba de um cliente com tesoura" fetchpriority="high">
            <figcaption class="vitrine-letreiro"><span>Desde</span><b>{{ site.desde }}</b></figcaption>
          </figure>
        </div>
      </section>

      <!-- preços + montar atendimento -->
      <section id="precos" class="precos">
        <div class="wrap precos-grid">
          <div class="quadro">
            <div class="quadro-head">
              <h2>Tabela da casa</h2>
              <p>Marque o que você quer fazer. Corte e barba juntos saem {{ brl(combo) }} mais barato.</p>
            </div>
            <ul class="lista">
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
          </div>

          <aside class="ficha" aria-live="polite">
            <h3>Seu atendimento</h3>
            <p v-if="!escolhidos.length" class="vazio">Marque pelo menos um serviço na tabela.</p>
            <template v-else>
              <p class="total"><b>{{ brl(total) }}</b><span>{{ duracao }} na cadeira</span></p>
              <p v-if="temCombo" class="combo">Combo corte + barba aplicado: {{ brl(combo) }} a menos</p>
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
            <a class="btn btn-vermelho btn-cheio" :class="{ off: !escolhidos.length }" :href="agendar" target="_blank" rel="noopener" :aria-disabled="!escolhidos.length"><svg><use href="#i-wa" /></svg>Pedir horário no WhatsApp</a>
            <p class="nota">A gente responde com os horários livres para você confirmar.</p>
          </aside>
        </div>
      </section>

      <!-- barbeiros -->
      <section id="barbeiros" class="barbeiros">
        <div class="wrap">
          <h2>Quem está na cadeira</h2>
          <div class="cadeiras">
            <article v-for="b in barbeiros" :key="b.n" class="barbeiro">
              <div class="foto-espaco" :class="`c${b.cadeira}`"><span class="num" aria-hidden="true">{{ b.cadeira }}</span><span class="aviso-foto">Foto do barbeiro</span></div>
              <h3>{{ b.n }}</h3>
              <p>Cadeira {{ b.cadeira }}. {{ b.d }}</p>
              <button type="button" class="link" @click="agendarCom(b.n)">Agendar com o {{ b.n }}</button>
            </article>
          </div>
        </div>
      </section>

      <!-- clube -->
      <section id="clube" class="clube">
        <div class="wrap clube-grid">
          <div class="clube-txt">
            <h2>Clube da casa</h2>
            <p>Para quem não gosta de ver o cabelo passar do ponto. Uma mensalidade e você vem quantas vezes quiser, de segunda a sexta.</p>
          </div>
          <div class="cartoes">
            <article v-for="(p, i) in planos" :key="p.n" class="cartao" :class="{ escuro: i === 1 }">
              <header><span class="cartao-marca">{{ site.marca }}</span><span class="cartao-n">Sócio nº 0{{ 47 + i * 64 }}</span></header>
              <h3>{{ p.n }}</h3>
              <p class="cartao-preco"><b>{{ brl(p.p) }}</b>/mês</p>
              <ul><li v-for="it in p.itens" :key="it">{{ it }}</li></ul>
              <a class="btn" :class="i === 1 ? 'btn-osso' : 'btn-verde'" :href="wa(`Olá! Quero entrar no ${p.n}.`)" target="_blank" rel="noopener">Quero ser sócio</a>
            </article>
          </div>
        </div>
      </section>

      <!-- sobre nós -->
      <!-- TODO: trocar pela história real e pelas fotos do espaço -->
      <section id="sobre" class="sobre">
        <div class="wrap sobre-grid">
          <div class="sobre-txt">
            <h2>Sobre nós</h2>
            <p>A {{ site.marca }} abriu em {{ site.desde }} com uma cadeira e um rádio. Hoje são três cadeiras, mas a ideia continua a mesma: corte bem feito, sem pressa, num lugar onde dá vontade de ficar.</p>
            <ul class="mimos">
              <li><b>Café passado na hora</b> e água gelada por conta da casa</li>
              <li><b>Cerveja e chope</b> para quem quiser, depois das 17h</li>
              <li><b>Futebol na TV</b> e Wi-Fi enquanto espera</li>
              <li><b>Navalha descartável</b> e toalha lavada a cada cliente</li>
            </ul>
          </div>
          <div class="sobre-fotos">
            <img :src="`${base}fotos/cadeiras.webp`" width="1400" height="1050" alt="Cadeiras clássicas de barbeiro e postes listrados" loading="lazy" class="f1">
            <img :src="`${base}fotos/navalha.webp`" width="1200" height="1564" alt="Barba sendo feita com navalha" loading="lazy" class="f2">
            <img :src="`${base}fotos/kit.webp`" width="1400" height="933" alt="Navalha, pincel e cuia de barbear" loading="lazy" class="f3">
          </div>
        </div>
      </section>

      <!-- avaliações -->
      <section class="avaliacoes">
        <div class="wrap">
          <div class="nota-google"><b>{{ site.notaGoogle }}</b><span>de 5 no Google<br>{{ site.avaliacoesGoogle }} avaliações</span></div>
          <div class="deps">
            <figure v-for="d in depoimentos" :key="d.n"><blockquote>“{{ d.t }}”</blockquote><figcaption>{{ d.n }}</figcaption></figure>
          </div>
          <p class="aviso">Avaliações de exemplo: substitua pelas avaliações reais do Google.</p>
        </div>
      </section>

      <!-- onde estamos -->
      <section id="onde" class="onde">
        <div class="wrap onde-grid">
          <div>
            <h2>Onde estamos</h2>
            <p class="endereco"><svg><use href="#i-pin" /></svg>{{ site.endereco }}</p>
            <p class="estac">{{ site.estacionamento }}.</p>
            <a class="btn btn-osso" :href="site.mapa" target="_blank" rel="noopener">Abrir no mapa</a>
          </div>
          <table class="horarios">
            <caption>Horário de funcionamento</caption>
            <tbody>
              <tr v-for="i in [1, 2, 3, 4, 5, 6, 0]" :key="i" :class="{ hoje: hojeIdx === i }">
                <th scope="row">{{ nomesDias[i] }}<span v-if="hojeIdx === i"> (hoje)</span></th>
                <td>{{ horario[i] ? `${horario[i]![0]}h às ${horario[i]![1]}h` : 'Fechado' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <footer class="rodape">
      <div class="wrap rod-top">
        <div>
          <a href="#" class="marca"><span class="poste-mini" aria-hidden="true" />{{ site.marca }}</a>
          <p>{{ site.endereco }}<br>CNPJ {{ site.cnpj }}</p>
        </div>
        <div class="rod-redes">
          <a :href="wa()" target="_blank" rel="noopener" aria-label="WhatsApp"><svg><use href="#i-wa" /></svg></a>
          <a :href="site.instagram" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-ig" /></svg></a>
        </div>
      </div>
      <div class="wrap"><div class="rod-final">
        <span>© {{ new Date().getFullYear() }} {{ site.marca }}. Fotos de ambientação: Gkbediako, Frank Schulenburg e Tomwsulcer, via Wikimedia Commons (CC BY-SA 4.0, CC BY-SA 3.0 e CC0).</span>
        <a class="rod-credito" href="https://www.ontrackagenciadigital.com.br/" target="_blank" rel="noopener">Desenvolvido por <b>OnTrack Agência Digital</b></a>
      </div></div>
    </footer>
  </div>
</template>
