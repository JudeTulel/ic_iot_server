"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_canister_ranges = exports.find_label = exports.flatten_forks = exports.lookup_path = exports.LookupStatus = exports.reconstruct = exports.lookupResultToBuffer = exports.Certificate = exports.hashTreeToString = exports.NodeType = exports.CertificateVerificationError = void 0;
const cbor = __importStar(require("./cbor"));
const errors_1 = require("./errors");
const request_id_1 = require("./request_id");
const buffer_1 = require("./utils/buffer");
const principal_1 = require("@dfinity/principal");
const bls = __importStar(require("./utils/bls"));
const leb_1 = require("./utils/leb");
/**
 * A certificate may fail verification with respect to the provided public key
 */
class CertificateVerificationError extends errors_1.AgentError {
    constructor(reason) {
        super(`Invalid certificate: ${reason}`);
    }
}
exports.CertificateVerificationError = CertificateVerificationError;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Empty"] = 0] = "Empty";
    NodeType[NodeType["Fork"] = 1] = "Fork";
    NodeType[NodeType["Labeled"] = 2] = "Labeled";
    NodeType[NodeType["Leaf"] = 3] = "Leaf";
    NodeType[NodeType["Pruned"] = 4] = "Pruned";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
/**
 * Make a human readable string out of a hash tree.
 * @param tree
 */
function hashTreeToString(tree) {
    const indent = (s) => s
        .split('\n')
        .map(x => '  ' + x)
        .join('\n');
    function labelToString(label) {
        const decoder = new TextDecoder(undefined, { fatal: true });
        try {
            return JSON.stringify(decoder.decode(label));
        }
        catch (e) {
            return `data(...${label.byteLength} bytes)`;
        }
    }
    switch (tree[0]) {
        case NodeType.Empty:
            return '()';
        case NodeType.Fork: {
            if (tree[1] instanceof Array && tree[2] instanceof ArrayBuffer) {
                const left = hashTreeToString(tree[1]);
                const right = hashTreeToString(tree[2]);
                return `sub(\n left:\n${indent(left)}\n---\n right:\n${indent(right)}\n)`;
            }
            else {
                throw new Error('Invalid tree structure for fork');
            }
        }
        case NodeType.Labeled: {
            if (tree[1] instanceof ArrayBuffer && tree[2] instanceof ArrayBuffer) {
                const label = labelToString(tree[1]);
                const sub = hashTreeToString(tree[2]);
                return `label(\n label:\n${indent(label)}\n sub:\n${indent(sub)}\n)`;
            }
            else {
                throw new Error('Invalid tree structure for labeled');
            }
        }
        case NodeType.Leaf: {
            if (!tree[1]) {
                throw new Error('Invalid tree structure for leaf');
            }
            else if (Array.isArray(tree[1])) {
                return JSON.stringify(tree[1]);
            }
            return `leaf(...${tree[1].byteLength} bytes)`;
        }
        case NodeType.Pruned: {
            if (!tree[1]) {
                throw new Error('Invalid tree structure for pruned');
            }
            else if (Array.isArray(tree[1])) {
                return JSON.stringify(tree[1]);
            }
            return `pruned(${(0, buffer_1.toHex)(new Uint8Array(tree[1]))}`;
        }
        default: {
            return `unknown(${JSON.stringify(tree[0])})`;
        }
    }
}
exports.hashTreeToString = hashTreeToString;
function isBufferGreaterThan(a, b) {
    const a8 = new Uint8Array(a);
    const b8 = new Uint8Array(b);
    for (let i = 0; i < a8.length; i++) {
        if (a8[i] > b8[i]) {
            return true;
        }
    }
    return false;
}
class Certificate {
    constructor(certificate, _rootKey, _canisterId, _blsVerify, 
    // Default to 5 minutes
    _maxAgeInMinutes = 5) {
        this._rootKey = _rootKey;
        this._canisterId = _canisterId;
        this._blsVerify = _blsVerify;
        this._maxAgeInMinutes = _maxAgeInMinutes;
        this.cert = cbor.decode(new Uint8Array(certificate));
    }
    /**
     * Create a new instance of a certificate, automatically verifying it. Throws a
     * CertificateVerificationError if the certificate cannot be verified.
     * @constructs  Certificate
     * @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
     * @param {ArrayBuffer} options.certificate The bytes of the certificate
     * @param {ArrayBuffer} options.rootKey The root key to verify against
     * @param {Principal} options.canisterId The effective or signing canister ID
     * @param {number} options.maxAgeInMinutes The maximum age of the certificate in minutes. Default is 5 minutes.
     * @throws {CertificateVerificationError}
     */
    static async create(options) {
        const cert = Certificate.createUnverified(options);
        await cert.verify();
        return cert;
    }
    static createUnverified(options) {
        let blsVerify = options.blsVerify;
        if (!blsVerify) {
            blsVerify = bls.blsVerify;
        }
        return new Certificate(options.certificate, options.rootKey, options.canisterId, blsVerify, options.maxAgeInMinutes);
    }
    lookup(path) {
        // constrain the type of the result, so that empty HashTree is undefined
        return lookup_path(path, this.cert.tree);
    }
    lookup_label(label) {
        return this.lookup([label]);
    }
    async verify() {
        const rootHash = await reconstruct(this.cert.tree);
        const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
        const sig = this.cert.signature;
        const key = extractDER(derKey);
        const msg = (0, buffer_1.concat)(domain_sep('ic-state-root'), rootHash);
        let sigVer = false;
        const lookupTime = lookupResultToBuffer(this.lookup(['time']));
        if (!lookupTime) {
            // Should never happen - time is always present in IC certificates
            throw new CertificateVerificationError('Certificate does not contain a time');
        }
        const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
        const MAX_AGE_IN_MSEC = this._maxAgeInMinutes * 60 * 1000;
        const now = Date.now();
        const earliestCertificateTime = now - MAX_AGE_IN_MSEC;
        const fiveMinutesFromNow = now + FIVE_MINUTES_IN_MSEC;
        const certTime = (0, leb_1.decodeTime)(lookupTime);
        if (certTime.getTime() < earliestCertificateTime) {
            throw new CertificateVerificationError(`Certificate is signed more than ${this._maxAgeInMinutes} minutes in the past. Certificate time: ` +
                certTime.toISOString() +
                ' Current time: ' +
                new Date(now).toISOString());
        }
        else if (certTime.getTime() > fiveMinutesFromNow) {
            throw new CertificateVerificationError('Certificate is signed more than 5 minutes in the future. Certificate time: ' +
                certTime.toISOString() +
                ' Current time: ' +
                new Date(now).toISOString());
        }
        try {
            sigVer = await this._blsVerify(new Uint8Array(key), new Uint8Array(sig), new Uint8Array(msg));
        }
        catch (err) {
            sigVer = false;
        }
        if (!sigVer) {
            throw new CertificateVerificationError('Signature verification failed');
        }
    }
    async _checkDelegationAndGetKey(d) {
        if (!d) {
            return this._rootKey;
        }
        const cert = await Certificate.createUnverified({
            certificate: d.certificate,
            rootKey: this._rootKey,
            canisterId: this._canisterId,
            blsVerify: this._blsVerify,
            // Do not check max age for delegation certificates
            maxAgeInMinutes: Infinity,
        });
        if (cert.cert.delegation) {
            throw new CertificateVerificationError('Delegation certificates cannot be nested');
        }
        await cert.verify();
        const canisterInRange = check_canister_ranges({
            canisterId: this._canisterId,
            subnetId: principal_1.Principal.fromUint8Array(new Uint8Array(d.subnet_id)),
            tree: cert.cert.tree,
        });
        if (!canisterInRange) {
            throw new CertificateVerificationError(`Canister ${this._canisterId} not in range of delegations for subnet 0x${(0, buffer_1.toHex)(d.subnet_id)}`);
        }
        const publicKeyLookup = lookupResultToBuffer(cert.lookup(['subnet', d.subnet_id, 'public_key']));
        if (!publicKeyLookup) {
            throw new Error(`Could not find subnet key for subnet 0x${(0, buffer_1.toHex)(d.subnet_id)}`);
        }
        return publicKeyLookup;
    }
}
exports.Certificate = Certificate;
const DER_PREFIX = (0, buffer_1.fromHex)('308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100');
const KEY_LENGTH = 96;
function extractDER(buf) {
    const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
    if (buf.byteLength !== expectedLength) {
        throw new TypeError(`BLS DER-encoded public key must be ${expectedLength} bytes long`);
    }
    const prefix = buf.slice(0, DER_PREFIX.byteLength);
    if (!(0, buffer_1.bufEquals)(prefix, DER_PREFIX)) {
        throw new TypeError(`BLS DER-encoded public key is invalid. Expect the following prefix: ${DER_PREFIX}, but get ${prefix}`);
    }
    return buf.slice(DER_PREFIX.byteLength);
}
/**
 * utility function to constrain the type of a path
 * @param {ArrayBuffer | HashTree | undefined} result - the result of a lookup
 * @returns ArrayBuffer or Undefined
 */
function lookupResultToBuffer(result) {
    if (result.status !== LookupStatus.Found) {
        return undefined;
    }
    if (result.value instanceof ArrayBuffer) {
        return result.value;
    }
    if (result.value instanceof Uint8Array) {
        return result.value.buffer;
    }
    return undefined;
}
exports.lookupResultToBuffer = lookupResultToBuffer;
/**
 * @param t
 */
async function reconstruct(t) {
    switch (t[0]) {
        case NodeType.Empty:
            return (0, request_id_1.hash)(domain_sep('ic-hashtree-empty'));
        case NodeType.Pruned:
            return t[1];
        case NodeType.Leaf:
            return (0, request_id_1.hash)((0, buffer_1.concat)(domain_sep('ic-hashtree-leaf'), t[1]));
        case NodeType.Labeled:
            return (0, request_id_1.hash)((0, buffer_1.concat)(domain_sep('ic-hashtree-labeled'), t[1], await reconstruct(t[2])));
        case NodeType.Fork:
            return (0, request_id_1.hash)((0, buffer_1.concat)(domain_sep('ic-hashtree-fork'), await reconstruct(t[1]), await reconstruct(t[2])));
        default:
            throw new Error('unreachable');
    }
}
exports.reconstruct = reconstruct;
function domain_sep(s) {
    const len = new Uint8Array([s.length]);
    const str = new TextEncoder().encode(s);
    return (0, buffer_1.concat)(len, str);
}
var LookupStatus;
(function (LookupStatus) {
    LookupStatus["Unknown"] = "unknown";
    LookupStatus["Absent"] = "absent";
    LookupStatus["Found"] = "found";
})(LookupStatus = exports.LookupStatus || (exports.LookupStatus = {}));
var LabelLookupStatus;
(function (LabelLookupStatus) {
    LabelLookupStatus["Less"] = "less";
    LabelLookupStatus["Greater"] = "greater";
})(LabelLookupStatus || (LabelLookupStatus = {}));
function lookup_path(path, tree) {
    if (path.length === 0) {
        switch (tree[0]) {
            case NodeType.Leaf: {
                if (!tree[1]) {
                    throw new Error('Invalid tree structure for leaf');
                }
                if (tree[1] instanceof ArrayBuffer) {
                    return {
                        status: LookupStatus.Found,
                        value: tree[1],
                    };
                }
                if (tree[1] instanceof Uint8Array) {
                    return {
                        status: LookupStatus.Found,
                        value: tree[1].buffer,
                    };
                }
                return {
                    status: LookupStatus.Found,
                    value: tree[1],
                };
            }
            default: {
                return {
                    status: LookupStatus.Found,
                    value: tree,
                };
            }
        }
    }
    const label = typeof path[0] === 'string' ? new TextEncoder().encode(path[0]) : path[0];
    const lookupResult = find_label(label, tree);
    switch (lookupResult.status) {
        case LookupStatus.Found: {
            return lookup_path(path.slice(1), lookupResult.value);
        }
        case LabelLookupStatus.Greater:
        case LabelLookupStatus.Less: {
            return {
                status: LookupStatus.Absent,
            };
        }
        default: {
            return lookupResult;
        }
    }
}
exports.lookup_path = lookup_path;
/**
 * If the tree is a fork, flatten it into an array of trees
 * @param t - the tree to flatten
 * @returns HashTree[] - the flattened tree
 */
function flatten_forks(t) {
    switch (t[0]) {
        case NodeType.Empty:
            return [];
        case NodeType.Fork:
            return flatten_forks(t[1]).concat(flatten_forks(t[2]));
        default:
            return [t];
    }
}
exports.flatten_forks = flatten_forks;
function find_label(label, tree) {
    switch (tree[0]) {
        // if we have a labelled node, compare the node's label to the one we are
        // looking for
        case NodeType.Labeled:
            // if the label we're searching for is greater than this node's label,
            // we need to keep searching
            if (isBufferGreaterThan(label, tree[1])) {
                return {
                    status: LabelLookupStatus.Greater,
                };
            }
            // if the label we're searching for is equal this node's label, we can
            // stop searching and return the found node
            if ((0, buffer_1.bufEquals)(label, tree[1])) {
                return {
                    status: LookupStatus.Found,
                    value: tree[2],
                };
            }
            // if the label we're searching for is not greater than or equal to this
            // node's label, then it's less than this node's label, and we can stop
            // searching because we've looked too far
            return {
                status: LabelLookupStatus.Less,
            };
        // if we have a fork node, we need to search both sides, starting with the left
        case NodeType.Fork:
            // search in the left node
            const leftLookupResult = find_label(label, tree[1]);
            switch (leftLookupResult.status) {
                // if the label we're searching for is greater than the left node lookup,
                // we need to search the right node
                case LabelLookupStatus.Greater: {
                    const rightLookupResult = find_label(label, tree[2]);
                    // if the label we're searching for is less than the right node lookup,
                    // then we can stop searching and say that the label is provably Absent
                    if (rightLookupResult.status === LabelLookupStatus.Less) {
                        return {
                            status: LookupStatus.Absent,
                        };
                    }
                    // if the label we're searching for is less than or equal to the right
                    // node lookup, then we let the caller handle it
                    return rightLookupResult;
                }
                // if the left node returns an uncertain result, we need to search the
                // right node
                case LookupStatus.Unknown: {
                    let rightLookupResult = find_label(label, tree[2]);
                    // if the label we're searching for is less than the right node lookup,
                    // then we also need to return an uncertain result
                    if (rightLookupResult.status === LabelLookupStatus.Less) {
                        return {
                            status: LookupStatus.Unknown,
                        };
                    }
                    // if the label we're searching for is less than or equal to the right
                    // node lookup, then we let the caller handle it
                    return rightLookupResult;
                }
                // if the label we're searching for is not greater than the left node
                // lookup, or the result is not uncertain, we stop searching and return
                // whatever the result of the left node lookup was, which can be either
                // Found or Absent
                default: {
                    return leftLookupResult;
                }
            }
        // if we encounter a Pruned node, we can't know for certain if the label
        // we're searching for is present or not
        case NodeType.Pruned:
            return {
                status: LookupStatus.Unknown,
            };
        // if the current node is Empty, or a Leaf, we can stop searching because
        // we know for sure that the label we're searching for is not present
        default:
            return {
                status: LookupStatus.Absent,
            };
    }
}
exports.find_label = find_label;
/**
 * Check if a canister falls within a range of canisters
 * @param canisterId Principal
 * @param ranges [Principal, Principal][]
 * @returns
 */
function check_canister_ranges(params) {
    const { canisterId, subnetId, tree } = params;
    const rangeLookup = lookup_path(['subnet', subnetId.toUint8Array(), 'canister_ranges'], tree);
    if (rangeLookup.status !== LookupStatus.Found || !(rangeLookup.value instanceof ArrayBuffer)) {
        throw new Error(`Could not find canister ranges for subnet ${subnetId}`);
    }
    const ranges_arr = cbor.decode(rangeLookup.value);
    const ranges = ranges_arr.map(v => [
        principal_1.Principal.fromUint8Array(v[0]),
        principal_1.Principal.fromUint8Array(v[1]),
    ]);
    const canisterInRange = ranges.some(r => r[0].ltEq(canisterId) && r[1].gtEq(canisterId));
    return canisterInRange;
}
exports.check_canister_ranges = check_canister_ranges;
//# sourceMappingURL=certificate.js.map