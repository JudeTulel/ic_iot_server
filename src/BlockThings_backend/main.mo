import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Error "mo:base/Error";
import Type "mo:candid/Type";
import Types "Types";
import UserThings "UserThings";
import IoTBackend "IoTBackend";
import IoTBackend "IoTBackend"

actor class Main() {
    private stable var userThingsActor : ?UserThings.UserThings = null;
    private stable var storageActor : ?DataStorage.DataStorage = null;
    private stable var backendActor : ?IoTBackend.IoTBackend = null;

    public shared(msg) func init() : async () {
        let ut = await UserThings.UserThings();
        let ds = await DataStorage.DataStorage();
        let be = await IoTBackend.IoTBackend();

        userThingsActor := ?ut;
        storageActor := ?ds;
        backendActor := ?be;

        await be.initialize(ds, ut);
    };
        private func getActors() : async* (UserThings.UserThings, DataStorage.DataStorage, IoTBackend.IoTBackend) {
        switch (userThingsActor, storageActor, backendActor) {
            case (?ut, ?ds, ?be) {
                (ut, ds, be)
            };
            case _ {
                await init();
                switch (userThingsActor, storageActor, backendActor) {
                    case (?ut, ?ds, ?be) {
                        (ut, ds, be)
                    };
                    case _ {
                        throw Error.reject("Failed to initialize actors");
                    };
                };
            };
        };
    };

    public shared(msg) func registerThing(name: Text) : async Types.Thing {
        let (ut, _, _) = await* getActors();
        await ut.registerThing(name);
    };

    // Modified to be non-query function
    public shared(msg) func getUserThings() : async [Types.Thing] {
        let (ut, _, _) = await* getActors();
        await ut.getUserThings();
    };

    public shared(msg) func removeThing(thingId: Types.ThingId) : async Bool {
        let (ut, _, _) = await* getActors();
        await ut.removeThing(thingId);
    };

    public shared(msg) func renameThing(thingId: Types.ThingId, newName: Text) : async Bool {
        let (ut, _, _) = await* getActors();
        await ut.renameThing(thingId, newName);
    };

    public shared(msg) func storeThingData(thingId: Types.ThingId, value: Float) : async Bool {
        let (_, ds, _) = await* getActors();
        await ds.storeData(thingId, value);
    };

    // Modified to be non-query function
    public shared(msg) func getThingData(thingId: Types.ThingId) : async [Types.DataEntry] {
        let (_, ds, _) = await* getActors();
        await ds.getData(thingId);
    };

    // Modified to be non-query function
    public shared(msg) func getThingDataInRange(
        thingId: Types.ThingId, 
        start: Time.Time, 
        end: Time.Time
    ) : async [Types.DataEntry] {
        let (_, ds, _) = await* getActors();
        await ds.getDataInRange(thingId, start, end);
    };

    public shared(msg) func markThingOnline(thingId: Types.ThingId) : async Bool {
        let (ut, _, _) = await* getActors();
        await ut.markThingOnline(thingId);
    };

    public shared(msg) func http_request(request : Types.HttpRequest) : async Types.HttpResponse {
        let (_, _, be) = await* getActors();
        await be.http_request(request);
    };

    system func preupgrade() {
        // Stable variables will automatically persist
    };

    system func postupgrade() {
        // Changed to async call in system function
        userThingsActor := null;
        storageActor := null;
        backendActor := null;
    };
}