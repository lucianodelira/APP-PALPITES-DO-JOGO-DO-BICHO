// script.js

/*************************************************
 URL DO GOOGLE APPS SCRIPT
*************************************************/

/*
PUBLIQUE O APPS SCRIPT COMO:

Implantar
→ Nova implantação
→ Aplicativo da Web

Permissões:
Qualquer pessoa

Depois cole a URL abaixo
*/

const API_URL = 'https://script.google.com/macros/s/AKfycbwbBpn8ye9dxT18WY0b_Vh2ZuaEGFWFVzmsAYrdT3uFAsf26cnQoYBy0aBDY1seK04ytg/exec';

/*************************************************
 LISTA
*************************************************/

const lista = document.getElementById('lista-palpite');

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

      const card = document.createElement('div');

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
            <strong>Horário:</strong>
            ${p.horario}
          </div>

        </div>

        <div class="milhar">
          ${p.milhar}
        </div>

        <div class="numeros">

          <span>
            Centena ${p.centena}
          </span>

          <span>
            Dezena ${p.dezena}
          </span>

        </div>

        <!-- BOTÕES -->

        <div class="botoes">

          <button
            class="btn-compartilhar"
            onclick="compartilhar(
              '${p.animal}',
              '${p.grupo}',
              '${p.milhar}',
              '${p.loteria}'
            )"
          >
            📲 Compartilhar
          </button>

          <button
            class="btn-copiar"
            onclick="copiarMilhar('${p.milhar}')"
          >
            📋 Copiar Milhar
          </button>

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
 COMPARTILHAR WHATSAPP
*************************************************/

function compartilhar(
  animal,
  grupo,
  milhar,
  loteria
){

  const texto = `

🐅 PALPITE DO DIA

🐾 Animal: ${animal}

🎯 Grupo: ${grupo}

🔢 Milhar: ${milhar}

🏆 Loteria: ${loteria}

🔥 Boa sorte!

`;

  const url =
    `https://wa.me/?text=${encodeURIComponent(texto)}`;

  window.open(url,'_blank');

}

/*************************************************
 COPIAR MILHAR
*************************************************/

function copiarMilhar(milhar){

  navigator.clipboard.writeText(milhar);

  mostrarMensagem(
    `Milhar ${milhar} copiada!`
  );

}

/*************************************************
 MENSAGEM
*************************************************/

function mostrarMensagem(texto){

  const msg = document.createElement('div');

  msg.className = 'mensagem-copy';

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
 INICIAR
*************************************************/

carregarPalpites();

/*************************************************
 AUTO UPDATE
*************************************************/

setInterval(() => {

  carregarPalpites();

},30000);
/*************************************************
 DATA E HORA
*************************************************/

const dataHora = document.getElementById('data-hora');

function atualizarDataHora(){

  const agora = new Date();

  const data = agora.toLocaleDateString('pt-BR');

  const hora = agora.toLocaleTimeString('pt-BR');

  dataHora.innerHTML = `
    📅 ${data} ⏰ ${hora}
  `;

}

/*************************************************
 INICIAR
*************************************************/

atualizarDataHora();

/*************************************************
 ATUALIZAR A CADA 1 SEGUNDO
*************************************************/

setInterval(() => {

  atualizarDataHora();

},1000);





/*************************************************
 HORÁRIOS DAS LOTERIAS
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

  // =========================================
  // PROCURAR PRÓXIMO HORÁRIO
  // =========================================

  for(let horario of horarios){

    const partes = horario.split(':');

    const hora = parseInt(partes[0]);

    const minuto = parseInt(partes[1]);

    const total = (hora * 60) + minuto;

    // SE AINDA NÃO PASSOU

    if(total > horaAtual){

      return horario;

    }

  }

  // =========================================
  // SE TODOS PASSARAM
  // VOLTA PARA PRIMEIRO HORÁRIO DO DIA SEGUINTE
  // =========================================

  return horarios[0];

}
