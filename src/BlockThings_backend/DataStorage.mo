//To do storage of historical data of iot devices based on time stamps
// src/DataStorage.mo

import Principal "mo:base/Principal";
import Time "mo:base/Time";

import Text "mo:base/Text";
 type ThingId = Nat;

type DataEntry = {
    timestamp: Time.Time;
    mesurement:Text;
    value: Float; // Adjust type based on your data (e.g., Float, Int, Text)
};

type DeviceData = {
    thingId: ThingId;
    data: [DataEntry];
};
// src/DataStorage.mo


actor DataStorage {
    stable var deviceDataMap: Map.Map<ThingId, [DataEntry]> = Map.Map();

    /*
     * Stores a data entry for a specific Thing.
     */
    public func storeData(thingId: ThingId, value: Float) : Bool {
        let entry = { timestamp = Time.now(); value = value };
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) {
                deviceDataMap.put(thingId, dataList # [entry]);
                return true;
            };
            case (_) {
                deviceDataMap.put(thingId, [entry]);
                return true;
            };
        }
    };

    /*
     * Retrieves all data entries for a specific Thing.
     */
    public query func getData(thingId: ThingId) : [DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) { return dataList; };
            case (_) { return []; };
        }
    };

    /*
     * Retrieves data within a specific time range for a Thing.
     */
    public query func getDataInRange(thingId: ThingId, start: Time.Time, end: Time.Time) : [DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) {
                return dataList.filter(entry -> entry.timestamp >= start && entry.timestamp <= end);
            };
            case (_) { return []; };
        }
    };
    public func filterThings(things : [Thing], thingId : ThingId) : [Thing] {
        var filteredThings : [Thing] = [];
        for (thing in things.vals()) {
            if (thing.id != thingId) {
                filteredThings := Array.append<Thing>(filteredThings, [thing]);
            };
        };
        return filteredThings;
    };
};
