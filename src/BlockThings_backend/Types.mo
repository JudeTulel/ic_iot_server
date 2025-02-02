import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat32 "mo:base/Nat32";

module {
    // Common types
    public type ThingId = Nat32;

    // DataStorage types

    // Then you can use the type like:
    // let entry : Types.DataEntry = { timestamp = Time.now(); value = 42.0 };

    // UserThings types
    public type Status = {
        online : Bool;
        lastSeen : Time.Time;
    };
 
    public type Thing = {
        id : ThingId;
        name : Text;
        nonce : Text;
        endpoint : Text;
        status : Status;
    };
    public type DataEntry = {
        timestamp : Time.Time;
        value : Float;
    };

    public type DeviceData = {
        thingId : ThingId;
        data : [DataEntry];
    };
    public type User = {
        principal : Principal;
        things : [Thing];
    };

    // IoTBackend types
    public type HeaderField = (Text, Text);

    public type HttpRequest = {
        method : Text;
        url : Text;
        headers : [HeaderField];
        body : Blob;
    };

    public type HttpResponse = {
        status_code : Nat16;
        headers : [HeaderField];
        body : Blob;
    };

    public type IoTData = {
        signature : Text;
        payload : {
            data : Float;
        };
    };
};
