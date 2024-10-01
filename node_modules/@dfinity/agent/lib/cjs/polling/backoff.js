"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExponentialBackoff_currentInterval, _ExponentialBackoff_randomizationFactor, _ExponentialBackoff_multiplier, _ExponentialBackoff_maxInterval, _ExponentialBackoff_startTime, _ExponentialBackoff_maxElapsedTime, _ExponentialBackoff_maxIterations, _ExponentialBackoff_date, _ExponentialBackoff_count;
Object.defineProperty(exports, "__esModule", { value: true });
exports.exponentialBackoff = exports.ExponentialBackoff = void 0;
const RANDOMIZATION_FACTOR = 0.5;
const MULTIPLIER = 1.5;
const INITIAL_INTERVAL_MSEC = 500;
const MAX_INTERVAL_MSEC = 60000;
const MAX_ELAPSED_TIME_MSEC = 900000;
const MAX_ITERATIONS = 10;
/**
 * Exponential backoff strategy.
 */
class ExponentialBackoff {
    constructor(options = ExponentialBackoff.default) {
        _ExponentialBackoff_currentInterval.set(this, void 0);
        _ExponentialBackoff_randomizationFactor.set(this, void 0);
        _ExponentialBackoff_multiplier.set(this, void 0);
        _ExponentialBackoff_maxInterval.set(this, void 0);
        _ExponentialBackoff_startTime.set(this, void 0);
        _ExponentialBackoff_maxElapsedTime.set(this, void 0);
        _ExponentialBackoff_maxIterations.set(this, void 0);
        _ExponentialBackoff_date.set(this, void 0);
        _ExponentialBackoff_count.set(this, 0);
        const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date, } = options;
        __classPrivateFieldSet(this, _ExponentialBackoff_currentInterval, initialInterval, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_randomizationFactor, randomizationFactor, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_multiplier, multiplier, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_maxInterval, maxInterval, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_date, date, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_startTime, date.now(), "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_maxElapsedTime, maxElapsedTime, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_maxIterations, maxIterations, "f");
    }
    get ellapsedTimeInMsec() {
        return __classPrivateFieldGet(this, _ExponentialBackoff_date, "f").now() - __classPrivateFieldGet(this, _ExponentialBackoff_startTime, "f");
    }
    get currentInterval() {
        return __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f");
    }
    get count() {
        return __classPrivateFieldGet(this, _ExponentialBackoff_count, "f");
    }
    get randomValueFromInterval() {
        const delta = __classPrivateFieldGet(this, _ExponentialBackoff_randomizationFactor, "f") * __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f");
        const min = __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f") - delta;
        const max = __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f") + delta;
        return Math.random() * (max - min) + min;
    }
    incrementCurrentInterval() {
        var _a;
        __classPrivateFieldSet(this, _ExponentialBackoff_currentInterval, Math.min(__classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f") * __classPrivateFieldGet(this, _ExponentialBackoff_multiplier, "f"), __classPrivateFieldGet(this, _ExponentialBackoff_maxInterval, "f")), "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_count, (_a = __classPrivateFieldGet(this, _ExponentialBackoff_count, "f"), _a++, _a), "f");
        return __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f");
    }
    next() {
        if (this.ellapsedTimeInMsec >= __classPrivateFieldGet(this, _ExponentialBackoff_maxElapsedTime, "f") || __classPrivateFieldGet(this, _ExponentialBackoff_count, "f") >= __classPrivateFieldGet(this, _ExponentialBackoff_maxIterations, "f")) {
            return null;
        }
        else {
            this.incrementCurrentInterval();
            return this.randomValueFromInterval;
        }
    }
}
exports.ExponentialBackoff = ExponentialBackoff;
_ExponentialBackoff_currentInterval = new WeakMap(), _ExponentialBackoff_randomizationFactor = new WeakMap(), _ExponentialBackoff_multiplier = new WeakMap(), _ExponentialBackoff_maxInterval = new WeakMap(), _ExponentialBackoff_startTime = new WeakMap(), _ExponentialBackoff_maxElapsedTime = new WeakMap(), _ExponentialBackoff_maxIterations = new WeakMap(), _ExponentialBackoff_date = new WeakMap(), _ExponentialBackoff_count = new WeakMap();
ExponentialBackoff.default = {
    initialInterval: INITIAL_INTERVAL_MSEC,
    randomizationFactor: RANDOMIZATION_FACTOR,
    multiplier: MULTIPLIER,
    maxInterval: MAX_INTERVAL_MSEC,
    // 1 minute
    maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
    maxIterations: MAX_ITERATIONS,
    date: Date,
};
/**
 * Utility function to create an exponential backoff iterator.
 * @param options - for the exponential backoff
 * @returns an iterator that yields the next delay in the exponential backoff
 * @yields the next delay in the exponential backoff
 */
function* exponentialBackoff(options = ExponentialBackoff.default) {
    const backoff = new ExponentialBackoff(options);
    let next = backoff.next();
    while (next) {
        yield next;
        next = backoff.next();
    }
}
exports.exponentialBackoff = exponentialBackoff;
//# sourceMappingURL=backoff.js.map