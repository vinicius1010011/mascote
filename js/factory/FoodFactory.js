class FoodFactory {
  static criar(world, pet, limiteCritico = 25) {
    const critico = FoodFactory.statMaisCritico(pet, limiteCritico);
    if (critico === "fome") return new KitEmergencia();
    if (critico === "energia") return new BateriaLiquida();
    if (critico === "felicidade") return new DoceNeon();

    const opcoes = world.periodo === "dia"
      ? [PelletSolar, PeixeBit]
      : [CristalDeDados, PeixeBit];

    const Escolhida = opcoes[Math.floor(Math.random() * opcoes.length)];
    return new Escolhida();
  }

  static statMaisCritico(pet, limite) {
    let pior = null;
    for (const stat in pet.stats) {
      if (pet.stats[stat] < limite && (pior === null || pet.stats[stat] < pet.stats[pior])) {
        pior = stat;
      }
    }
    return pior;
  }
}