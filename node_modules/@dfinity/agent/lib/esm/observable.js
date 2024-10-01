export class Observable {
    constructor() {
        this.observers = [];
    }
    subscribe(func) {
        this.observers.push(func);
    }
    unsubscribe(func) {
        this.observers = this.observers.filter(observer => observer !== func);
    }
    notify(data, ...rest) {
        this.observers.forEach(observer => observer(data, ...rest));
    }
}
export class ObservableLog extends Observable {
    constructor() {
        super();
    }
    print(message, ...rest) {
        this.notify({ message, level: 'info' }, ...rest);
    }
    warn(message, ...rest) {
        this.notify({ message, level: 'warn' }, ...rest);
    }
    error(message, error, ...rest) {
        this.notify({ message, level: 'error', error }, ...rest);
    }
}
//# sourceMappingURL=observable.js.map