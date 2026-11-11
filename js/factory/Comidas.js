class Comida {
  constructor(nome, emoji, descricao, efeitos) {
    this.nome = nome;
    this.emoji = emoji;
    this.descricao = descricao;
    this.efeitos = efeitos; 
  }

  aplicar(pet) {
    for (const stat in this.efeitos) {
      const novo = pet.stats[stat] + this.efeitos[stat];
      pet.stats[stat] = Math.min(100, Math.max(0, novo));
    }
  }
}

class PelletSolar extends Comida {
  constructor() {
    super("Pellet Solar", "🔆", "Carregado pela luz do dia.", { fome: 20, energia: 10 });
  }
}

class CristalDeDados extends Comida {
  constructor() {
    super("Cristal de Dados", "💎", "Brilha no escuro e anima o Axo.", { fome: 15, felicidade: 10 });
  }
}

class PeixeBit extends Comida {
  constructor() {
    super("Peixe-Bit", "🐟", "Clássico e saboroso.", { fome: 25, felicidade: 5 });
  }
}

class KitEmergencia extends Comida {
  constructor() {
    super("Kit de Emergência", "🚑", "Ração concentrada!", { fome: 60 });
  }
}

class BateriaLiquida extends Comida {
  constructor() {
    super("Bateria Líquida", "🔋", "Recarga rápida de energia.", { energia: 50 });
  }
}

class DoceNeon extends Comida {
  constructor() {
    super("Doce Neon", "🍬", "Um mimo que levanta o astral.", { felicidade: 40 });
  }
}