import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Map "mo:base/Map";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

actor DataStorage {
    private type ThingId = Nat;

    private type DataEntry = {
        timestamp : Time.Time;
        value : Float;
    };

    private type DeviceData = {
        thingId : ThingId;
        data : [DataEntry];
    };

    // Create a stable variable to store the data entries
    private stable var entries : [(ThingId, [DataEntry])] = [];
    
    // Initialize the map in the constructor
    private var deviceDataMap = Map.fromIter<ThingId, [DataEntry]>(
        entries.vals(),
        10,
        Nat.equal,
        Hash.hash,
    );

    // Add system func to save state before upgrades
    system func preupgrade() {
        entries := Iter.toArray(deviceDataMap.entries());
    };

    // Add system func to restore state after upgrades
    system func postupgrade() {
        entries := [];
    };

    public func storeData(thingId : ThingId, value : Float) : async Bool {
        let entry = { 
            timestamp = Time.now(); 
            value = value 
        };
        
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) {
                deviceDataMap.put(thingId, Array.append(dataList, [entry]));
                true;
            };
            case (_) {
                deviceDataMap.put(thingId, [entry]);
                true;
            };
        };
    };

    public query func getData(thingId : ThingId) : async [DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) { dataList };
            case (_) { [] };
        };
    };

    public query func getDataInRange(thingId : ThingId, start : Time.Time, end : Time.Time) : async [DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) {
                Array.filter<DataEntry>(
                    dataList,
                    func(entry : DataEntry) : Bool {
                        entry.timestamp >= start and entry.timestamp <= end
                    }
                );
            };
            case (_) { [] };
        };
    };
}