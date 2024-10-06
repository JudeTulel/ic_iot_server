//To do storage of historical data of iot devices based on time stamps
// src/DataStorage.mo

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Map "mo:base/Map";
 
type ThingId = Nat;

type DataEntry = {
    timestamp : Time.Time;
    value : Float;
};

type DeviceData = {
    thingId : ThingId;
    data : [DataEntry];
};
// src/DataStorage.mo

actor DataStorage {

    stable var deviceDataMap : Map.Map<ThingId, [DataEntry]> = Map.Map();

    /*
     * Stores a data entry for a specific Thing.
     */
    public func storeData(thingId : ThingId, value : Float) : Bool {
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
        };
    };

    /*
     * Retrieves all data entries for a specific Thing.
     */
    public query func getData(thingId : ThingId) : [DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) { return dataList };
            case (_) { return [] };
        };
    };

    /*
     * Retrieves data within a specific time range for a Thing.
     */
    public query func getDataInRange(thingId : ThingId, start : Time.Time, end : Time.Time) : [DataEntry] {
        switch (deviceDataMap.get(thingId)) {
            case (?dataList) {
              let filteredDataList = filterEntries(dataList, start, end); 
                return filteredDataList;
            };
            case (_) { return [] };
        };
    };
   public func filterEntries(dataList : [Entry], start : Time, end : Time) : [Entry] {
    var filteredEntries : [Entry] = [];
    for (entry in dataList.vals()) {
        if (entry.timestamp >= start and entry.timestamp <= end) {
            filteredEntries := Array.append<Entry>(filteredEntries, [entry]);
        };
    };
    return filteredEntries;
};
};
