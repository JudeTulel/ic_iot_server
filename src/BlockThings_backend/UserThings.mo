import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Nat16 "mo:base/Nat16";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";

actor UserThings {
    type ThingId = Nat;

    type Thing = {
        id : ThingId;
        name : Text;
        nonce : Text;
        endpoint : Text;
        status : Status;
    };

    type Status = {
        online : Bool;
        lastSeen : Time.Time;
    };

    type User = {
        principal : Principal;
        things : [Thing];
    };

    private stable var users : [User] = [];
    private stable var nextThingId : ThingId = 1;

    private func generateNonce() : Text {
        let seed : Blob = "\14\C9\72\09\03\D4\D5\72\82\95\E5\43\AF\FA\A9\44\49\2F\25\56\13\F3\6E\C7\B0\87\DC\76\08\69\14\CF";
        let nonceBytes = Random.rangeFrom(16, seed);
        let nonceText = Nat.toText(nonceBytes);
        nonceText
    };

    private func createThing(name : Text) : Thing {
        let nonce = generateNonce();
        {
            id = nextThingId;
            name = name;
            nonce = nonce;
            endpoint = "";
            status = { 
                online = false; 
                lastSeen = Time.now() 
            };
        }
    };

    public shared(msg) func registerThing(name : Text) : async Thing {
        let caller = msg.caller;
        let thing = createThing(name);
        
        let newUsers = Array.map<User, User>(users, func (user : User) : User {
            if (Principal.equal(user.principal, caller)) {
                {
                    principal = user.principal;
                    things = Array.append(user.things, [thing]);
                }
            } else {
                user
            }
        });

        if (Array.equal<User>(users, newUsers, func(a: User, b: User) : Bool { 
            Principal.equal(a.principal, b.principal) 
        })) {
            // User not found, create new user
            users := Array.append(users, [{
                principal = caller;
                things = [thing];
            }]);
        } else {
            users := newUsers;
        };

        nextThingId += 1;
        thing
    };

    public shared query(msg) func getUserThings() : async [Thing] {
        let caller = msg.caller;
        switch (Array.find<User>(users, func (user : User) : Bool { 
            Principal.equal(user.principal, caller) 
        })) {
            case (?user) { user.things };
            case null { [] };
        }
    };

    public shared(msg) func removeThing(thingId : ThingId) : async Bool {
        let caller = msg.caller;
        var thingRemoved = false;

        let newUsers = Array.map<User, User>(users, func (user : User) : User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.filter<Thing>(user.things, func (t : Thing) : Bool {
                    if (t.id == thingId) {
                        thingRemoved := true;
                        false
                    } else {
                        true
                    }
                });
                {
                    principal = user.principal;
                    things = newThings;
                }
            } else {
                user
            }
        });

        users := newUsers;
        thingRemoved
    };

    public shared(msg) func renameThing(thingId : ThingId, newName : Text) : async Bool {
        let caller = msg.caller;
        var thingRenamed = false;

        let newUsers = Array.map<User, User>(users, func (user : User) : User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.map<Thing, Thing>(user.things, func (t : Thing) : Thing {
                    if (t.id == thingId) {
                        thingRenamed := true;
                        {
                            id = t.id;
                            name = newName;
                            nonce = t.nonce;
                            endpoint = t.endpoint;
                            status = t.status;
                        }
                    } else {
                        t
                    }
                });
                {
                    principal = user.principal;
                    things = newThings;
                }
            } else {
                user
            }
        });

        users := newUsers;
        thingRenamed
    };

    public shared(msg) func updateThingEndpoint(thingId : ThingId, newEndpoint : Text) : async Bool {
        let caller = msg.caller;
        var endpointUpdated = false;

        let newUsers = Array.map<User, User>(users, func (user : User) : User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.map<Thing, Thing>(user.things, func (t : Thing) : Thing {
                    if (t.id == thingId) {
                        endpointUpdated := true;
                        {
                            id = t.id;
                            name = t.name;
                            nonce = t.nonce;
                            endpoint = newEndpoint;
                            status = t.status;
                        }
                    } else {
                        t
                    }
                });
                {
                    principal = user.principal;
                    things = newThings;
                }
            } else {
                user
            }
        });

        users := newUsers;
        endpointUpdated
    };

    public shared(msg) func markThingOnline(thingId : ThingId) : async Bool {
        let caller = msg.caller;
        var statusUpdated = false;

        let newUsers = Array.map<User, User>(users, func (user : User) : User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.map<Thing, Thing>(user.things, func (t : Thing) : Thing {
                    if (t.id == thingId) {
                        statusUpdated := true;
                        {
                            id = t.id;
                            name = t.name;
                            nonce = t.nonce;
                            endpoint = t.endpoint;
                            status = {
                                online = true;
                                lastSeen = Time.now();
                            };
                        }
                    } else {
                        t
                    }
                });
                {
                    principal = user.principal;
                    things = newThings;
                }
            } else {
                user
            }
        });

        users := newUsers;
        statusUpdated
    };
}