class Humor {
  constructor(nome, emoji, descricao) {
    this.nome = nome;
    this.emoji = emoji;
    this.descricao = descricao;
  }

  aplica(pet, world) {
    return false;
  }

  
  modificarEfeito(tipoAcao, stat, valor) {
    return valor;
  }
}

class Sonolento extends Humor {
  constructor() {
    super("Sonolento", "😴", "Bateria baixa: dormir rende mais, brincar rende menos.");
  }
  aplica(pet) {
    return pet.stats.energia < 30;
  }
  modificarEfeito(tipo, stat, valor) {
    if (tipo === "dormir") return valor * 1.5;
    if (tipo === "brincar" && stat === "felicidade") return valor * 0.5;
    return valor;
  }
}

class Melancolico extends Humor {
  constructor() {
    super("Melancólico", "😢", "Triste: precisa de brincadeira, que rende mais felicidade.");
  }
  aplica(pet) {
    return pet.stats.felicidade < 35;
  }
  modificarEfeito(tipo, stat, valor) {
    if (tipo === "brincar" && stat === "felicidade") return valor * 1.5;
    return valor;
  }
}

class Brincalhao extends Humor {
  constructor() {
    super("Brincalhão", "🤩", "Animado: brincar rende mais, mas gasta mais energia.");
  }
  aplica(pet) {
    return pet.stats.felicidade >= 70 && pet.stats.energia >= 50;
  }
  modificarEfeito(tipo, stat, valor) {
    if (tipo === "brincar" && stat === "felicidade") return valor * 1.2;
    if (tipo === "brincar" && stat === "energia") return valor * 1.5;
    return valor;
  }
}

class Curioso extends Humor {
  constructor() {
    super("Curioso", "🧐", "Equilibrado: tudo funciona normalmente.");
  }
  aplica() {
    return true; 
  }
}

const HUMORES = [new Sonolento(), new Melancolico(), new Brincalhao(), new Curioso()];

class HumorSelector {
  static escolher(pet, world) {
    return HUMORES.find(h => h.aplica(pet, world));
  }
}