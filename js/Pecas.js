class PecaDecorator {
  constructor(nome, emoji) {
    this.nome = nome;
    this.emoji = emoji;
  }
}

class BracoMecanico extends PecaDecorator {
  constructor() { super("Braço Mecânico", "🦾"); }
}

class OlhoSensor extends PecaDecorator {
  constructor() { super("Olho Sensor", "👁️"); }
}

class CaudaTurbo extends PecaDecorator {
  constructor() { super("Cauda Turbo", "🚀"); }
}

const PECAS = [
  new BracoMecanico(),
  new OlhoSensor(),
  new CaudaTurbo(),
];
