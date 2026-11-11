const game = GameManager.getInstance();
const ui = new UIObserver(game);
game.subscribe(ui);

game.subscribe(new SoundObserver());
ui.iniciarPecas();

document.getElementById("btn-alimentar").onclick = () => game.alimentar();
document.getElementById("btn-brincar").onclick  = () => game.brincar();
document.getElementById("btn-dormir").onclick   = () => game.dormir();

document.getElementById("btn-reiniciar").onclick = () => location.reload();

// Set initial background
document.getElementById("bg-layer").style.backgroundImage = "url('assets/images/bg_day.png')";

game.start();
