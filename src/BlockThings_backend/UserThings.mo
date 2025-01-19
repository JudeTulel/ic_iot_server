//To do linking user to iot created
// src/UserThings.mo

import Principal "mo:base/Principal";
import ChaChaRNG "mo:csprng";
import Array "mo:base/Array"; 
//import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Types "Types";
actor UserThings {
    stable var users : [Types.User] = [];
    stable var nextThingId : Types.ThingId = 1;
    private var RNG : ?ChaChaRNG.RNG = null;
    /*
     * Generates a random nonce.
     */
    private func initRNG() : async () {
    let key = await Random.blob();
   
    let nonce = await Random.blob();
    let cipherRounds = 8; //8, 12, and 20 are most common for ChaCha; More rounds increase security but consume more computation/cycles
    RNG := ?ChaChaRNG.RNG(key, nonce, cipherRounds);
  };
     public func getRandomNumber(min : Nat64, max : Nat64) : async Nat {
    switch (RNG) {
      case (?rng) rng.getRandomNumber(min, max);
      case (null) {
        await initRNG();
        await getRandomNumber(min, max)
      };
    };
  };

    /*
     * Creates a new Thing with a unique ID and a generated nonce.
     */
   private func createThing(name : Text) : async Types.Thing {
        let currnonce = await getRandomNumber(1000000,9999999);
        {
            id = nextThingId;
            name = name;
            nonce = Nat.toText(currnonce);
            endpoint = "";
            status = { 
                online = false; 
                lastSeen = Time.now() 
            };
        }
    };

    public shared(msg) func registerThing(name : Text) : async Types.Thing {
        let caller = msg.caller;

        let thing = await createThing(name);
        
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