// > Alteração de design do Convite de acordo com Promotor
function designConvite() {
    const cardConvite = document.getElementById('mainCard')
    const promotor = document.getElementById('promotor')

    if (!promotor) return;

    const promotorMkt = promotor.value;

    // > Remove todas as classes de estilo anteriores
    cardConvite.classList.remove('convitePaulo', 'conviteTalita', 'conviteVinicius', 'conviteYan');

    if (promotorMkt === "Paulo Cesar") {
        cardConvite.classList.add('convitePaulo');
    } else if (promotorMkt === "Talita Lima") {
        cardConvite.classList.add('conviteTalita');
    } else if (promotorMkt === "Vinicius Manzzato") {
        cardConvite.classList.add('conviteVinicius');
    } else if (promotorMkt === "Yan Bueno") {
        cardConvite.classList.add('conviteYan');
    } else {
        cardConvite.classList.add('conviteYan');
    }
}

// > Deixar tela em FullScreen
function fullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}
