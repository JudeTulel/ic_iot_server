import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
    // Common types
    public type ThingId = Nat;

    // DataStorage types
    public type DataEntry = {
        timestamp : Time.Time;
        value : Float;
    };

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
}