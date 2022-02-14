export default class Queue<T> {
    _store: T[] = [];
    constructor(){}
    push(val: T) {
      this._store.push(val);
    }
    pop(): T | undefined {
      return this._store.shift();
    }
    setStore(val: T[]) {
      this._store = val;
    }
}