class GameManager extends Subject {
  static #instance = null;

  static getInstance() {
    if (!GameManager.#instance) {
      GameManager.#instance = new GameManager();
    }
    return GameManager.#instance;
  }

  constructor() {
    if (GameManager.#instance) {
      throw new Error("Use GameManager.getInstance() em vez de new.");
    }
    super();

    this.pet = {
      nome: "Axo-9",
      stats: { fome: 100, energia: 100, felicidade: 100 },
    };

    this.world = { ticks: 0, periodo: "dia" };

    this.humor = HumorSelector.escolher(this.pet, this.world);

    this.TICK_MS = 1000;
    this.TICKS_POR_PERIODO = 30;
    this.LIMITE_ALERTA = 25;
    this.gameOver = false;
    this.motivoGameOver = "";
    this.timerId = null;
    this.alertados = new Set();
  }

  start() {
    this.timerId = setInterval(() => this.tick(), this.TICK_MS);
    this.notify("estado");
  }

  tick() {
    if (this.gameOver) return;

    this.world.ticks++;
    this.world.periodo = "dia";

    const perda = this.calcularPerda();
    for (const stat in perda) {
      this.pet.stats[stat] = Math.max(0, this.pet.stats[stat] - perda[stat]);
    }

    this.checarAlertas();
    this.atualizarHumor();
    this.verificarGameOver();

    if (this.gameOver) {
      this.notify("gameover");
    } else {
      this.notify("estado");
    }
  }

  calcularPerda() {
    const base = { fome: 2, energia: 1.5, felicidade: 1 };
    if (this.world.periodo === "noite") {
      base.fome = 1;
      base.energia = 2.5;
    }
    return base;
  }

  atualizarHumor() {
    const novo = HumorSelector.escolher(this.pet, this.world);
    if (novo !== this.humor) {
      this.humor = novo;
      this.notify("humor", { humor: novo });
    }
  }

  checarAlertas() {
    for (const stat in this.pet.stats) {
      const critico = this.pet.stats[stat] < this.LIMITE_ALERTA;
      if (critico && !this.alertados.has(stat)) {
        this.alertados.add(stat);
        this.notify("alerta", { stat });
      } else if (!critico) {
        this.alertados.delete(stat);
      }
    }
  }

  verificarGameOver() {
    for (const stat in this.pet.stats) {
      if (this.pet.stats[stat] <= 0) {
        this.gameOver = true;
        this.motivoGameOver = `Falha crítica: ${stat} chegou a zero. Axo-9 entrou em desligamento.`;
        clearInterval(this.timerId);
        return;
      }
    }
  }

  alimentar() {
    if (this.gameOver) return;
    const comida = FoodFactory.criar(this.world, this.pet, this.LIMITE_ALERTA);
    this.#aplicarEfeitos("alimentar", comida.efeitos);
    this.notify("acao", {
      tipo: "alimentar",
      mensagem: `Axo-9 comeu ${comida.emoji} ${comida.nome}. ${comida.descricao}`,
    });
  }

  brincar() {
    if (this.gameOver) return;
    this.#aplicarEfeitos("brincar", { felicidade: 20, energia: -10 });
    this.notify("acao", { tipo: "brincar", mensagem: "Axo-9 se divertiu!" });
  }

  dormir() {
    if (this.gameOver) return;
    this.#aplicarEfeitos("dormir", { energia: 30 });
    this.notify("acao", { tipo: "dormir", mensagem: "Zzz... modo de economia ativado." });
  }

  #aplicarEfeitos(tipoAcao, efeitos) {
    for (const stat in efeitos) {
      const valor = this.humor.modificarEfeito(tipoAcao, stat, efeitos[stat]);
      const novo = this.pet.stats[stat] + valor;
      this.pet.stats[stat] = Math.min(100, Math.max(0, Math.round(novo)));
    }
    this.checarAlertas();
    this.atualizarHumor();
    this.notify("estado");
  }
}