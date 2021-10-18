
function onRem() {
    let width = document.documentElement.clientWidth;
    switch (true) {
        case (width > 650):
            document.documentElement.style.fontSize = width / 1920 + 'px';
            break;
        case (width < 650):
            document.documentElement.style.fontSize = width / 320 + 'px';
            break;
    }
}

window.addEventListener('resize', onRem);

onRem();
