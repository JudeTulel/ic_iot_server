import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Types "Types";
import BespokeHash "Bespoke";

actor class DataStorage() {
    // Create a stable array to hold data between upgrades
    private stable var entries : [(Types.ThingId, [Types.DataEntry])] = [];

    // Create the HashMap with proper initialization
    private var deviceDataMap = Map.HashMap<Types.ThingId, [Types.DataEntry]>(
        10,      // Initial capacity
        Nat32.equal,
        BespokeHash.hash
    );

    // Initialize the map from stable storage after upgrade
    system func postupgrade() {
        deviceDataMap := Map.HashMap(10, Nat32.equal, BespokeHash.hash);
        for ((k, v) in entries.vals()) {
            deviceDataMap.put(k, v);
        };
        entries := []; // Clear entries after restoration
    };

    // Save state before upgrades
    system func preupgrade() {
        entries := Iter.toArray(deviceDataMap.entries());
    };

    public func storeData(thingId : Types.ThingId, value : Float) : async Bool {
        let entry : Types.DataEntry = {
            timestamp = Time.now();
            value = value;
        };

        switch (deviceDataMap.get(thingId)) {
            case (?existingData) {
                deviceDataMap.put(thingId, Array.append(existingData, [entry]));
                true;
            };
            case null {
                deviceDataMap.put(thingId, [entry]);
                true;
            };
        };
    };

    public query func getData(thingId : Types.ThingId) : async [Types.DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?data) { data };
            case null { [] };
        };
    };

    public query func getDataInRange(thingId : Types.ThingId, start : Time.Time, end : Time.Time) : async [Types.DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) {
                Array.filter<Types.DataEntry>(
                    dataList,
                    func(entry : Types.DataEntry) : Bool {
                        entry.timestamp >= start and entry.timestamp <= end
                    }
                );
            };
            case null { [] };
        };
    };
}
