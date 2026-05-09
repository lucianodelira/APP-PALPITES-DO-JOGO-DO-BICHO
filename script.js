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

    const response = await fetch(API_URL);

    const json = await response.json();

    lista.innerHTML = '';

    // =========================================
    // VERIFICAR
    // =========================================

    if(!json.success){

      lista.innerHTML = `
        <div class="erro">
          Erro ao carregar palpites
        </div>
      `;

      return;
    }

    // =========================================
    // PEGAR DADOS
    // =========================================

    const palpites = json.data;

    // =========================================
    // MOSTRAR CARDS
    // =========================================

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

        <button
          class="btn"
          onclick="compartilhar(
            '${p.animal}',
            '${p.grupo}',
            '${p.milhar}',
            '${p.loteria}'
          )"
        >
          Compartilhar WhatsApp
        </button>

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
 WHATSAPP
*************************************************/

function compartilhar(
  animal,
  grupo,
  milhar,
  loteria
){

  const texto = `

🐅 PALPITE DO DIA

🎯 Animal: ${animal}

🏆 Grupo: ${grupo}

🔢 Milhar: ${milhar}

📌 Loteria: ${loteria}

🔥 Boa sorte!

`;

  const url =
    `https://wa.me/?text=${encodeURIComponent(texto)}`;

  window.open(url,'_blank');

}

/*************************************************
 AUTO CARREGAR
*************************************************/

carregarPalpites();

/*************************************************
 ATUALIZAR AUTOMÁTICO
*************************************************/

setInterval(() => {

  carregarPalpites();

}, 30000);
