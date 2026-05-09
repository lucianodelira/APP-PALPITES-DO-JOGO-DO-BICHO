
const palpites = [
  {
    animal:'Águia',
    grupo:'02',
    milhar:'2345',
    loteria:'RIO/FEDERAL',
    horario:'11:00'
  },
  {
    animal:'Leão',
    grupo:'16',
    milhar:'7788',
    loteria:'BAHIA',
    horario:'14:00'
  }
];

const lista = document.getElementById('lista-palpite');

palpites.forEach(p => {

  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="animal">${p.animal}</div>
    <div>Loteria: ${p.loteria}</div>
    <div>Horário: ${p.horario}</div>
    <div>Grupo: ${p.grupo}</div>
    <div class="milhar">${p.milhar}</div>
    <button class="btn" onclick="compartilhar('${p.animal}','${p.milhar}')">
      Compartilhar WhatsApp
    </button>
  `;

  lista.appendChild(card);
});

function compartilhar(animal, milhar){

  const texto = `🐅 PALPITE DO DIA\n\nAnimal: ${animal}\nMilhar: ${milhar}`;

  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;

  window.open(url, '_blank');
}
