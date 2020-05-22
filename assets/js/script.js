const startBtn = document.querySelector('#start');
const output = document.querySelector('#output');
startBtn.addEventListener('click', () => start());

function start() {
  const recognition = new webkitSpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.start();
  recognition.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const content = event.results[i][0].transcript.trim();
        output.textContent = content;
        buscarFilme(content)
      }
    }
  };
};

function buscarFilme(filme) { 
    let apikey = '1c88466d'
    let uri = "http://www.omdbapi.com/?s=" + filme + "&apikey=" + apikey

    fetch(uri)
    .then(r => r.json())
    .then(resultado => {
        console.log(resultado.Search)
    })
}