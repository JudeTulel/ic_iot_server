import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Type "mo:candid/Type";
import Types "Types";

actor class UserThings() {
    private stable var users : [Types.User] = [];
    private stable var nextThingId : Types.ThingId = 1;

    private func generateNonce() : Text {
        let seed : Blob = "\14\C9\72\09\03\D4\D5\72\82\95\E5\43\AF\FA\A9\44\49\2F\25\56\13\F3\6E\C7\B0\87\DC\76\08\69\14\CF";
        let nonceBytes = Random.rangeFrom(16, seed);
        let nonceText = Nat.toText(nonceBytes);
        nonceText
    };

    private func createThing(name : Text) : Types.Thing {
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

    public shared(msg) func registerThing(name : Text) : async Types.Thing {
        let caller = msg.caller;
        let thing = createThing(name);
        
        let newUsers = Array.map<Types.User, Types.User>(users, func (user : Types.User) : Types.User {
            if (Principal.equal(user.principal, caller)) {
                {
                    principal = user.principal;
                    things = Array.append(user.things, [thing]);
                }
            } else {
                user
            }
        });

        if (Array.equal<Types.User>(users, newUsers, func(a: Types.User, b: Types.User) : Bool { 
            Principal.equal(a.principal, b.principal) 
        })) {
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

    public shared query(msg) func getUserThings() : async [Types.Thing] {
        let caller = msg.caller;
        switch (Array.find<Types.User>(users, func (user : Types.User) : Bool { 
            Principal.equal(user.principal, caller) 
        })) {
            case (?user) { user.things };
            case null { [] };
        }
    };


    public shared(msg) func removeThing(thingId : Types.ThingId) : async Bool {
        let caller = msg.caller;
        var thingRemoved = false;

        let newUsers = Array.map<Types.User, Types.User>(users, func (user : Types.User) : Types.User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.filter<Types.Thing>(user.things, func (t : Types.Thing) : Bool {
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

    public shared(msg) func renameThing(thingId : Types.ThingId, newName : Text) : async Bool {
        let caller = msg.caller;
        var thingRenamed = false;

        let newUsers = Array.map<Types.User, Types.User>(users, func (user : Types.User) : Types.User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.map<Types.Thing, Types.Thing>(user.things, func (t : Types.Thing) : Types.Thing {
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

    public shared(msg) func updateThingEndpoint(thingId : Types.ThingId, newEndpoint : Text) : async Bool {
        let caller = msg.caller;
        var endpointUpdated = false;

        let newUsers = Array.map<Types.User, Types.User>(users, func (user : Types.User) : Types.User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.map<Types.Thing, Types.Thing>(user.things, func (t : Types.Thing) : Types.Thing {
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

    public shared(msg) func markThingOnline(thingId : Types.ThingId) : async Bool {
        let caller = msg.caller;
        var statusUpdated = false;

        let newUsers = Array.map<Types.User, Types.User>(users, func (user : Types.User) : Types.User {
            if (Principal.equal(user.principal, caller)) {
                let newThings = Array.map<Types.Thing, Types.Thing>(user.things, func (t : Types.Thing) : Types.Thing {
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
};
