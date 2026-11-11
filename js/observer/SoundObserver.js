class SoundObserver {
  constructor() {
    this.ctx = null;
  }

  update(evento, dados) {
    switch (evento) {
      case "acao":
        if (dados.tipo === "alimentar") this.tocar([500, 700], 0.1, "sine");
        if (dados.tipo === "brincar")   this.tocar([600, 800, 1000], 0.08, "triangle");
        if (dados.tipo === "dormir")    this.tocar([400, 300, 200], 0.15, "sine");
        break;
      
      case "gameover":
        this.tocar([400, 300, 200, 100], 0.25, "sawtooth");
        break;
    }
  }

  tocar(frequencias, duracao, tipo) {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === "suspended") this.ctx.resume();

    frequencias.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      gain.gain.value = 0.08; // volume baixo
      osc.connect(gain).connect(this.ctx.destination);
      const inicio = this.ctx.currentTime + i * duracao;
      osc.start(inicio);
      osc.stop(inicio + duracao);
    });
  }
}