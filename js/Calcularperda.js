
class PerdaBase {
  calcular(world, pet) {
    const perda = { fome: 2, energia: 1.5, felicidade: 1 };
    if (world.periodo === "noite") {
      perda.fome = 1;
      perda.energia = 2.5;
    }
    return perda;
  }

  descricao() {
    return "Base";
  }
}