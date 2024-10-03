//To do linking user to iot created
// src/UserThings.mo

import Principal "mo:base/Principal";
import Crypto "mo:base/Crypto";

public type ThingId = Nat;

public type Thing = {
    id: ThingId;
    name: Text;
    nonce: Text;
    endpoint: Text;
    status: Status;
};

public type Status = {
    online: Bool;
    lastSeen: Time.Time;
};

public type User = {
    principal: Principal;
    things: [Thing];
};


import Principal "mo:base/Principal";
import Crypto "mo:base/Crypto";
import Time "mo:base/Time";

actor UserThings {
    stable var users: [User] = [];
    stable var nextThingId: ThingId = 1;

    /*
     * Generates a random nonce encoded in hexadecimal.
     */
    func generateNonce() : Text {
        let nonceBytes = Crypto.randomBytes(16); // 128-bit nonce
        return Crypto.hexEncode(nonceBytes);
    };

    /*
     * Creates a new Thing with a unique ID and a generated nonce.
     */
    func createThing(name: Text) : Thing {
        let nonce = generateNonce();
        let thing = {
            id = nextThingId;
            name = name;
            nonce = nonce;
            endpoint = "";
            status = { online = false; lastSeen = Time.now(); };
        };
        nextThingId += 1;
        return thing;
    };

    /*
     * Registers a new Thing for the caller.
     */
    public func registerThing(name: Text) : Thing {
        let caller = msg.caller;
        let userIndex = users.findIndex(user -> user.principal == caller);
        let thing = createThing(name);
        switch (userIndex) {
            case (?i) {
                users[i].things := users[i].things # [thing];
                return thing;
            };
            case (_) {
                let user = { principal = caller; things = [thing] };
                users := users # [user];
                return thing;
            };
        }
    };

    /*
     * Retrieves all Things associated with the caller.
     */
    public query func getUserThings() : [Thing] {
        let caller = msg.caller;
        for (user in users) {
            if (user.principal == caller) {
                return user.things;
            };
        };
        return [];
    };

    /*
     * Removes a Thing by its ID for the caller.
     */
    public func removeThing(thingId: ThingId) : Bool {
        let caller = msg.caller;
        for (user in users) {
            if (user.principal == caller) {
                let originalLength = user.things.size();
                user.things := user.things.filter(thing -> thing.id != thingId);
                if (user.things.size() < originalLength) {
                    return true; // Thing removed
                };
            };
        };
        return false; // Thing not found
    };

    /*
     * Renames a Thing for the caller.
     */
    public func renameThing(thingId: ThingId, newName: Text) : Bool {
        let caller = msg.caller;
        for (user in users) {
            if (user.principal == caller) {
                for (thing in user.things.vals()) {
                    if (thing.id == thingId) {
                        let updatedThing = { thing with name = newName };
                        user.things := user.things.map(t -> if (t.id == thingId) { updatedThing } else { t });
                        return true;
                    };
                };
            };
        };
        return false; // Thing not found
    };

    /*
     * Updates the endpoint for a Thing.
     */
    public func updateThingEndpoint(thingId: ThingId, newEndpoint: Text) : Bool {
        let caller = msg.caller;
        for (user in users) {
            if (user.principal == caller) {
                for (thing in user.things.vals()) {
                    if (thing.id == thingId) {
                        let updatedThing = { thing with endpoint = newEndpoint };
                        user.things := user.things.map(t -> if (t.id == thingId) { updatedThing } else { t });
                        return true;
                    };
                };
            };
        };
        return false; // Thing not found
    };

    /*
     * Marks a Thing as online and updates the last seen timestamp.
     */
    public func markThingOnline(thingId: ThingId) : Bool {
        let caller = msg.caller;
        for (user in users) {
            if (user.principal == caller) {
                for (thing in user.things.vals()) {
                    if (thing.id == thingId) {
                        let updatedThing = { thing with status = { online = true; lastSeen = Time.now() } };
                        user.things := user.things.map(t -> if (t.id == thingId) { updatedThing } else { t });
                        return true;
                    };
                };
            };
        };
        return false; // Thing not found
    };
};
