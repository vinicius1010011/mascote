class UIObserver {
  constructor(game) {
    this.game = game;
    this.bgDay = "assets/images/bg_day.png";
    this.bgNight = "assets/images/bg_night.png";
    this.petImages = {
      normal:   "assets/images/axolote_main.png",
      sleeping: "assets/images/emotion_sleeping.png",
      sad:      "assets/images/emotion_sad.png",
      happy:    "assets/images/emotion_happy.png",
      broken:   "assets/images/emotion_broken.png",
    };
    this.itemImages = {
      coin:    "assets/images/item_coin.png",
      crystal: "assets/images/item_crystal.png",
      fish:    "assets/images/item_fish.png",
      medkit:  "assets/images/item_medkit.png",
      potion:  "assets/images/item_potion.png",
      candy:   "assets/images/item_candy.png",
    };
    this.pecasImages = {
      "Braço Mecânico": "assets/images/part_arm.png",
      "Olho Sensor":    "assets/images/part_eye.png",
      "Cauda Turbo":    "assets/images/part_form_upgraded.png",
    };
    // combo key: sorted initials joined, e.g. arm+eye = "AE", arm+eye+tail = "AET"
    this.comboSprites = {
      "":    "assets/images/axolote_main.png",
      "A":   "assets/images/combo_arm.png",
      "E":   "assets/images/combo_eye.png",
      "T":   "assets/images/combo_tail.png",
      "AE":  "assets/images/combo_eye_arm.png",
      "AT":  "assets/images/combo_arm_tail.png",
      "ET":  "assets/images/combo_eye_tail.png",
      "AET": "assets/images/combo_all.png",
    };
    this.pecasEquipadas = new Set();
    this._lastPeriodo = null;
    this._lastHumor = null;
  }

  update(evento, dados) {
    switch (evento) {
      case "estado":
        this.renderBarras();
        this.renderMundo();
        this.renderHumor();
        this.renderPet();
        break;
      case "acao":
        this.mostrarItem(dados.tipo);
        break;
      case "alerta":
        break;
      case "gameover":
        this.renderBarras();
        this.mostrarGameOver();
        break;
    }
  }

  renderBarras() {
    for (const stat in this.game.pet.stats) {
      const valor = this.game.pet.stats[stat];
      const barra = document.getElementById(`bar-${stat}`);
      if (!barra) continue;
      barra.style.width = valor + "%";
      barra.style.background = valor < 25 ? "#ff5d5d" : valor < 50 ? "#ffd166" : "#3ddc97";
    }
  }

  renderMundo() {
    const w = this.game.world;
    document.getElementById("world-info").textContent = "";

    if (w.periodo !== this._lastPeriodo) {
      this._lastPeriodo = w.periodo;
      const bg = document.getElementById("bg-layer");
      const img = w.periodo === "dia" ? this.bgDay : this.bgNight;
      bg.style.backgroundImage = `url('assets/images/${w.periodo === "dia" ? "bg_day" : "bg_night"}.png')`;
    }
  }

  renderHumor() {
    const h = this.game.humor;
    document.getElementById("humor-info").textContent = "";
  }

  renderPet() {
    if (this.game.gameOver) return;
    // Se há peças equipadas, mantém o sprite de combo — não sobrescreve
    if (this.pecasEquipadas && this.pecasEquipadas.size > 0) return;

    const h = this.game.humor;
    const pet = document.getElementById("pet-img");
    let src = this.comboSprites[""] || this.petImages.normal;

    if (h.nome === "Sonolento") src = this.petImages.sleeping;
    else if (h.nome === "Melancólico") src = this.petImages.sad;
    else if (h.nome === "Brincalhão") src = this.petImages.happy;

    if (!pet.src.endsWith(src.split("/").pop())) {
      pet.style.opacity = "0";
      setTimeout(() => {
        pet.src = src;
        pet.style.opacity = "1";
        pet.classList.remove("broken");
      }, 200);
    }
  }

  mostrarItem(tipo) {
    const display = document.getElementById("item-display");
    const map = {
      alimentar: ["medkit", "fish", "coin"],
      brincar:   ["candy", "crystal"],
      dormir:    ["potion"],
    };
    const keys = map[tipo] || [];
    display.innerHTML = "";
    keys.forEach(k => {
      if (this.itemImages[k]) {
        const img = document.createElement("img");
        img.src = this.itemImages[k];
        img.alt = k;
        display.appendChild(img);
      }
    });
    setTimeout(() => { display.innerHTML = ""; }, 2500);
  }

  mostrarMensagem(texto) {
    document.getElementById("message").textContent = texto;
  }

  iniciarPecas() {
    const modal  = document.getElementById("pecas-modal");
    const lista  = document.getElementById("pecas-lista");

    // Monta os botões de cada peça
    PECAS.forEach(peca => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:10px;background:#1d2f4a;border-radius:8px;padding:8px 12px;";

      const img = document.createElement("img");
      img.src = this.pecasImages[peca.nome] || "";
      img.style.cssText = "width:36px;height:36px;image-rendering:pixelated;";

      const label = document.createElement("span");
      label.textContent = peca.nome;
      label.style.flex = "1";

      const btn = document.createElement("button");
      btn.textContent = "Equipar";
      btn.style.cssText = "padding:6px 12px;font-size:12px;";
      btn.dataset.nome = peca.nome;

      btn.onclick = () => {
        const equipada = this.pecasEquipadas.has(peca.nome);
        if (equipada) {
          this.pecasEquipadas.delete(peca.nome);
          btn.textContent = "Equipar";
          btn.style.background = "#4aa8ff";
        } else {
          this.pecasEquipadas.add(peca.nome);
          btn.textContent = "Remover";
          btn.style.background = "#3ddc97";
        }
        this.updatePetSprite();
      };

      row.appendChild(img);
      row.appendChild(label);
      row.appendChild(btn);
      lista.appendChild(row);
    });

    document.getElementById("btn-pecas").onclick = () => {
      modal.style.display = "flex";
    };
    document.getElementById("btn-fechar-pecas").onclick = () => {
      modal.style.display = "none";
    };
  }

  getComboKey() {
    const map = { "Braço Mecânico": "A", "Olho Sensor": "E", "Cauda Turbo": "T" };
    return ["A","E","T"].filter(k =>
      [...this.pecasEquipadas].some(n => map[n] === k)
    ).join("");
  }

  updatePetSprite() {
    if (this.game.gameOver) return;
    const key = this.getComboKey();
    const src = this.comboSprites[key] || this.petImages.normal;
    const pet = document.getElementById("pet-img");
    pet.style.opacity = "0";
    setTimeout(() => { pet.src = src; pet.style.opacity = "1"; }, 200);
  }

  mostrarGameOver() {
    const pet = document.getElementById("pet-img");
    pet.src = this.petImages.broken;
    pet.classList.add("broken");
    document.getElementById("gameover-msg").textContent = "";
    document.getElementById("gameover-screen").classList.add("visible");
    document.querySelectorAll("button:not(#btn-reiniciar)").forEach(b => (b.disabled = true));
  }
}
