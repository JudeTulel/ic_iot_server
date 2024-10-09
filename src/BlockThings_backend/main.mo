import UserThings "UserThings";
import DataStorage "DataStorage";
import IoTBackend "IoTBackend";


actor Main {
    stable var userThings = UserThings.UserThings(); // Initialize UserThings
    stable var storage = DataStorage.DataStorage(); // Initialize DataStorage
    stable var backend = IoTBackend.IoTBackend(); // Initialize IoTBackend

    // Expose the public functions of UserThings
    public func registerThing(name: Text) : async UserThings.Thing {
        return await userThings.registerThing(name);
    };

    public query func getUserThings() : async [UserThings.Thing] {
        return await userThings.getUserThings();
    };

    public func removeThing(thingId: UserThings.ThingId) : async Bool {
        return await userThings.removeThing(thingId);
    };

    public func renameThing(thingId: UserThings.ThingId, newName: Text) : async Bool {
        return await userThings.renameThing(thingId, newName);
    };

    public func updateThingEndpoint(thingId: UserThings.ThingId, newEndpoint: Text) : async Bool {
        return await userThings.updateThingEndpoint(thingId, newEndpoint);
    };

    public func markThingOnline(thingId: UserThings.ThingId) : async Bool {
        return await userThings.markThingOnline(thingId);
    };

    // Expose DataStorage functionality
    public func storeThingData(thingId: UserThings.ThingId, data: Text) : async Bool {
        return await storage.storeData(thingId, data);
    };

    public query func retrieveThingData(thingId: UserThings.ThingId) : async ?Text {
        return await storage.retrieveData(thingId);
    };

    // Expose IoTBackend functionality
    public func sendThingCommand(thingId: UserThings.ThingId, command: Text) : async Bool {
        return await backend.sendCommand(thingId, command);
    };

    public query func getThingStatus(thingId: UserThings.ThingId) : async IoTBackend.Status {
        return await backend.getThingStatus(thingId);
    };
};
