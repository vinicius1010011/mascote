
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  
  notify(evento, dados = {}) {
    for (const observer of this.observers) {
      observer.update(evento, dados);
    }
  }
}