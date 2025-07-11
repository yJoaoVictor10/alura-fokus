const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const somPause = new Audio('/sons/pause.mp3');
const somPlay = new Audio('/sons/play.wav');
const somBeep = new Audio('/sons/beep.mp3')
musica.loop = true; // Música ficará em loop
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPasarBt = document.querySelector('#start-pause span')
const imgIniciar_pausar = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
let intervaloId = null;

let tempoDecorridoEmSegundos = 1500; // 25 minutos em segundos

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');

})

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;

        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?,<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;

        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.,<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;

        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        somBeep.play();
        alert('Tempo finalizado!');
        zerar();
        return // Para parar de executar o código
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    somPlay.play();
    if (intervaloId) { // Se tiver valor em intervaloId, esse caso é para pausar
        zerar();
        return
    }
    intervaloId = setInterval(contagemRegressiva, 1000); //inicia um temporizador que executa a função contagemRegressiva a cada 1 segundo, usando o método setInterval.
    imgIniciar_pausar.setAttribute('src', '/imagens/pause.png');
    iniciarOuPasarBt.textContent = 'Pausar';
}

function zerar() {
    clearInterval(intervaloId); // Isso pausa a execução de contagemRegressiva() sem resetar o número.
    intervaloId = null;
    imgIniciar_pausar.setAttribute('src', '/imagens/play_arrow.png');
    iniciarOuPasarBt.textContent = 'Começar';
    somPlay.pause();
    somPause.play();
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000); // é uma forma prática de converter segundos em um formato de relógio "MM:SS"
    const tempoFormatado = tempo.toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();