import Nat32 "mo:base/Nat32";
module BespokeHash {
    public type Hash = Nat32;

    public let length : Nat32 = 31;

    public func bit(h : Hash, pos : Nat32) : Bool {
        assert (pos <= length);
        (h & (1 << pos)) != 0
    };

    public func equal(ha : Hash, hb : Hash) : Bool {
        ha == hb
    };

    // Jenkins one-at-a-time hash function
    public func hash(n : Nat32) : Hash {
        var hash : Nat32 = 0;
        var remaining = n;
        while (remaining > 0) {
            let chunk = remaining & 0xFF; // Take the lowest 8 bits
            hash += chunk;
            hash += hash << 10;
            hash ^= hash >> 6;
            remaining >>= 8; // Shift right by 8 bits
        };
        hash += hash << 3;
        hash ^= hash >> 11;
        hash += hash << 15;
        hash
    };
};
