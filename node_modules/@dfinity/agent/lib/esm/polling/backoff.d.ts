export declare type BackoffStrategy = {
    next: () => number | null;
    currentInterval?: number;
    count?: number;
    ellapsedTimeInMsec?: number;
};
export declare type BackoffStrategyArgs = {
    maxIterations?: number;
    maxElapsedTime?: number;
};
export declare type BackoffStrategyFactory = (args?: BackoffStrategyArgs) => BackoffStrategy;
export declare type ExponentialBackoffOptions = {
    initialInterval?: number;
    randomizationFactor?: number;
    multiplier?: number;
    maxInterval?: number;
    maxElapsedTime?: number;
    maxIterations?: number;
    date?: DateConstructor;
};
/**
 * Exponential backoff strategy.
 */
export declare class ExponentialBackoff {
    #private;
    static default: {
        initialInterval: number;
        randomizationFactor: number;
        multiplier: number;
        maxInterval: number;
        maxElapsedTime: number;
        maxIterations: number;
        date: DateConstructor;
    };
    constructor(options?: ExponentialBackoffOptions);
    get ellapsedTimeInMsec(): number;
    get currentInterval(): number;
    get count(): number;
    get randomValueFromInterval(): number;
    incrementCurrentInterval(): number;
    next(): number | null;
}
/**
 * Utility function to create an exponential backoff iterator.
 * @param options - for the exponential backoff
 * @returns an iterator that yields the next delay in the exponential backoff
 * @yields the next delay in the exponential backoff
 */
export declare function exponentialBackoff(options?: ExponentialBackoffOptions): Generator<number, void, unknown>;
