/*************************************************
 URL API
*************************************************/

const API_URL =
'https://script.google.com/macros/s/AKfycbz5IvvaLjGuhvBD6xHAwuTsVBA9wEFu2t4rbgpwx4YMc6B-_bhhNY1WwkEAvPfQoogXsw/exec';

/*************************************************
 CONTAINER
*************************************************/

const lista =
document.getElementById(
  'lista-palpite'
);

/*************************************************
 CARREGAR PALPITES
*************************************************/

async function carregarPalpites(){

  try{

    lista.innerHTML = `
      <div class="loading">
        Carregando palpites...
      </div>
    `;

    const response =
      await fetch(API_URL);

    const json =
      await response.json();

    lista.innerHTML = '';

    if(!json.success){

      lista.innerHTML = `
        <div class="erro">
          Erro ao carregar palpites
        </div>
      `;

      return;

    }

    const palpites =
      json.data || [];

    if(!palpites.length){

      lista.innerHTML = `
        <div class="erro">
          Nenhum palpite disponível
        </div>
      `;

      return;

    }

    palpites.forEach(p => {

      const card =
        document.createElement('div');

      card.className =
        'card';

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

        <div class="botoes">

          <button
            class="btn-compartilhar"
            onclick='compartilhar(${JSON.stringify(p)})'
          >
            📲 Compartilhar
          </button>

          <button
            class="btn-copiar"
            onclick='copiarMilhar(${JSON.stringify(p)})'
          >
            📋 Copiar
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
 COMPARTILHAR
*************************************************/

/*************************************************
 COMPARTILHAR
*************************************************/

function compartilhar(p){

  const agora = new Date();

  const data =
    agora.toLocaleDateString('pt-BR');

  const hora =
    agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

  const listaMilhares =
    p.milhares
      .map(m => m.milhar)
      .join('\n');

  const texto = `📅 Data: ${data}

🕒 Horário: ${hora}

🎰 Loteria: ${p.loteria}

⏳ Próxima Extração: ${p.horario}

🐾 Animal: ${p.animal}

🎯 Grupo: ${p.grupo}

🔥 PALPITES
----------------------------------

💎 Milhar:

${listaMilhares}

🍀 Boa sorte!

🌐 www.zepitaco.com`;

  const url =
    `https://wa.me/?text=${encodeURIComponent(texto)}`;

  window.open(
    url,
    '_blank'
  );

}

/*************************************************
 COPIAR MILHARES
*************************************************/

function copiarMilhar(p){

  const milhares =

    p.milhares
      .map(m => m.milhar)
      .join(', ');

  navigator.clipboard
    .writeText(milhares);

  mostrarMensagem(
    'Milhares copiadas!'
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

  msg.innerText =
    texto;

  document.body
    .appendChild(msg);

  setTimeout(() => {

    msg.classList.add(
      'mostrar'
    );

  },100);

  setTimeout(() => {

    msg.classList.remove(
      'mostrar'
    );

    setTimeout(() => {

      msg.remove();

    },300);

  },2500);

}

/*************************************************
 DATA E HORA
*************************************************/

const dataHora =
document.getElementById(
  'data-hora'
);

function atualizarDataHora(){

  if(!dataHora) return;

  const agora =
    new Date();

  dataHora.innerHTML = `
    📅 ${agora.toLocaleDateString('pt-BR')}
    ⏰ ${agora.toLocaleTimeString('pt-BR')}
  `;

}

/*************************************************
 INICIAR
*************************************************/

carregarPalpites();

atualizarDataHora();

/*************************************************
 RELÓGIO
*************************************************/

setInterval(() => {

  atualizarDataHora();

},1000);

/*************************************************
 ATUALIZAR SOMENTE VISUAL
*************************************************/

setInterval(() => {

  carregarPalpites();

},60000);
