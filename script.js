// script.js

/*************************************************
 URL DO GOOGLE APPS SCRIPT
*************************************************/

const API_URL =
'https://script.google.com/macros/s/AKfycbwbBpn8ye9dxT18WY0b_Vh2ZuaEGFWFVzmsAYrdT3uFAsf26cnQoYBy0aBDY1seK04ytg/exec';

/*************************************************
 LISTA
*************************************************/

const lista =
document.getElementById('lista-palpite');

/*************************************************
 CARREGAR PALPITES
*************************************************/

async function carregarPalpites(){

  try{

    lista.innerHTML = `
      <div class="loading">
        Atualizando palpites...
      </div>
    `;

    const response = await fetch(
      API_URL + '?t=' + new Date().getTime()
    );

    const json = await response.json();

    lista.innerHTML = '';

    if(!json.success){

      lista.innerHTML = `
        <div class="erro">
          Erro ao carregar palpites
        </div>
      `;

      return;

    }

    const palpites = json.data;

    palpites.forEach(p => {

      const card =
      document.createElement('div');

      card.className = 'card';

      card.innerHTML = `

        <div class="top-card">

          <div class="animal">
            🐾 ${p.animal}
          </div>

          <div class="grupo">
            Grupo ${p.grupo}
          </div>

        </div>

        <div class="linha"></div>

        <div class="info">

          <div>
            <strong>Loteria:</strong>
            ${p.loteria}
          </div>

          <div>
            <strong>Próxima Extração:</strong>
            ${pegarProximoHorario(p.loteria)}
          </div>

        </div>

        <div class="lista-milhares">

          ${p.milhares.map((m,index) => `

            <div class="milhar-card">

              <div class="milhar-numero">
                ${m.milhar}
              </div>

              <div class="milhar-info">

                <span>
                  ${index + 1}° Palpite
                </span>

                <span>
                  Dezena ${m.dezena}
                </span>

              </div>

            </div>

          `).join('')}

        </div>

        <!-- BOTÕES -->

        <div class="botoes">

          <!-- COMPARTILHAR -->

          <button
            class="btn-compartilhar"
            onclick='compartilhar(${JSON.stringify(p)})'
          >
            📲 Compartilhar
          </button>

          <!-- COPIAR -->

          <button
            class="btn-copiar"
            onclick='copiarMilhar(${JSON.stringify(p)})'
          >
            📋 Copiar          </button>

        </div>

      `;

      lista.appendChild(card);

    });

  }catch(erro){

    console.log(erro);

    lista.innerHTML = `
      <div class="erro">
        Erro ao conectar com servidor
      </div>
    `;

  }

}

/*************************************************
 COMPARTILHAR 5 MILHARES
*************************************************/

/*************************************************
 COMPARTILHAR FORMATO PROFISSIONAL
*************************************************/

function compartilhar(p){

  // =========================================
  // DATA E HORA
  // =========================================

  const agora = new Date();

  const data =
    agora.toLocaleDateString('pt-BR');

  const hora =
    agora.toLocaleTimeString(
      'pt-BR',
      {
        hour:'2-digit',
        minute:'2-digit'
      }
    );

  // =========================================
  // PRÓXIMO HORÁRIO
  // =========================================

  const proximoHorario =
    pegarProximoHorario(
      p.loteria
    );

  // =========================================
  // LISTA DAS MILHARES
  // =========================================

  const listaMilhares =
    p.milhares
      .map(m => m.milhar)
      .join('\n');

  // =========================================
  // TEXTO WHATSAPP
  // =========================================

  const texto = `🐅 PALPITE DO DIA

📅 Data: ${data}

⏰ Horário: ${hora}

🏆 Loteria: ${p.loteria}

🎯 Próxima Extração: ${proximoHorario}

🐾 Animal: ${p.animal}

🎯 Grupo: ${p.grupo}

📌 PALPITES
----------------------------------

🔢 Milhar:

${listaMilhares}

🔥 Boa sorte!

🌐 www.zepitaco.com`;

  // =========================================
  // ABRIR WHATSAPP
  // =========================================

  const url =
    `https://wa.me/?text=${encodeURIComponent(texto)}`;

  window.open(url,'_blank');

}

/*************************************************
 COPIAR SOMENTE AS 5 MILHARES
*************************************************/

function copiarMilhar(p){

  // =========================================
  // PEGAR AS 5 MILHARES
  // =========================================

  const milhares = p.milhares
    .map(m => m.milhar)
    .join(', ');

  // =========================================
  // COPIAR
  // =========================================

  navigator.clipboard.writeText(
    milhares
  );

  // =========================================
  // MENSAGEM
  // =========================================

  mostrarMensagem(
    '5 milhares copiadas!'
  );

}

/*************************************************
 TOAST
*************************************************/

function mostrarMensagem(texto){

  const msg =
  document.createElement('div');

  msg.className =
  'mensagem-copy';

  msg.innerText = texto;

  document.body.appendChild(msg);

  setTimeout(() => {

    msg.classList.add('mostrar');

  },100);

  setTimeout(() => {

    msg.classList.remove('mostrar');

    setTimeout(() => {

      msg.remove();

    },300);

  },2500);

}

/*************************************************
 DATA E HORA
*************************************************/

const dataHora =
document.getElementById('data-hora');

function atualizarDataHora(){

  if(!dataHora) return;

  const agora = new Date();

  const data =
  agora.toLocaleDateString('pt-BR');

  const hora =
  agora.toLocaleTimeString('pt-BR');

  dataHora.innerHTML = `
    📅 ${data} ⏰ ${hora}
  `;

}

/*************************************************
 HORÁRIOS LOTERIAS
*************************************************/

const HORARIOS_LOTERIAS = {

  'RIO/FEDERAL': [
    '11:00',
    '14:00',
    '16:00',
    '18:00',
    '21:00'
  ],

  'LOTEP': [
    '13:00',
    '16:00',
    '19:00'
  ],

  'BAHIA': [
    '10:00',
    '12:00',
    '15:00',
    '19:00'
  ],

  'NACIONAL': [
    '18:00'
  ],

  'LOOK/GOIAS': [
    '19:00'
  ],

  'SAO-PAULO': [
    '14:00',
    '16:00',
    '18:00',
    '21:00'
  ]

};

/*************************************************
 PEGAR PRÓXIMO HORÁRIO
*************************************************/

function pegarProximoHorario(nomeLoteria){

  const horarios =
  HORARIOS_LOTERIAS[nomeLoteria];

  if(!horarios) return '--:--';

  const agora = new Date();

  const horaAtual =

    agora.getHours() * 60 +
    agora.getMinutes();

  for(let horario of horarios){

    const partes =
    horario.split(':');

    const hora =
    parseInt(partes[0]);

    const minuto =
    parseInt(partes[1]);

    const total =
    (hora * 60) + minuto;

    if(total > horaAtual){

      return horario;

    }

  }

  return horarios[0];

}

/*************************************************
 INICIAR
*************************************************/

carregarPalpites();

atualizarDataHora();

/*************************************************
 AUTO UPDATE
*************************************************/

/*************************************************
 AUTO ATUALIZAÇÃO POR HORÁRIO
*************************************************/

// GUARDA O ÚLTIMO HORÁRIO

let ultimoHorarioGlobal = '';

/*************************************************
 PEGAR HORÁRIO ATUAL
*************************************************/

function pegarHorarioAtual(){

  const agora = new Date();

  return (
    agora.getHours()
    .toString()
    .padStart(2,'0')

    +

    ':'

    +

    agora.getMinutes()
    .toString()
    .padStart(2,'0')
  );

}

/*************************************************
 VERIFICAR MUDANÇA DE EXTRAÇÃO
*************************************************/

function verificarMudancaHorario(){

  // =========================================
  // PEGAR TODOS HORÁRIOS
  // =========================================

  let horarios = [];

  Object.values(HORARIOS_LOTERIAS)
  .forEach(lista => {

    lista.forEach(h => {

      horarios.push(h);

    });

  });

  // REMOVE DUPLICADOS

  horarios =
  [...new Set(horarios)];

  // =========================================
  // HORÁRIO ATUAL
  // =========================================

  const horarioAtual =
  pegarHorarioAtual();

  // =========================================
  // SE PASSOU DE UM HORÁRIO
  // =========================================

  if(
    horarios.includes(horarioAtual)
    &&
    ultimoHorarioGlobal !== horarioAtual
  ){

    ultimoHorarioGlobal =
    horarioAtual;

    console.log(
      'Atualizando palpites:',
      horarioAtual
    );

    carregarPalpites();

    mostrarMensagem(
      '🔥 Novos palpites liberados!'
    );

  }

}

/*************************************************
 VERIFICAR A CADA 20 SEGUNDOS
*************************************************/

setInterval(() => {

  verificarMudancaHorario();

},20000);
/*************************************************
 RELÓGIO
*************************************************/

setInterval(() => {

  atualizarDataHora();

},1000);