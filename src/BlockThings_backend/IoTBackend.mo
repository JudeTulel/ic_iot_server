import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Sha256 "mo:sha2/Sha256";
import { JSON; Candid; CBOR; URLEncoded } "mo:serde";

actor IoTBackend {
    // Type definitions
    type HeaderField = (Text, Text);

    type HttpRequest = {
        method: Text;
        url: Text;
        headers: [HeaderField];
        body: Blob;
    };

    type HttpResponse = {
        status_code: Nat16;
        headers: [HeaderField];
        body: Blob;
    };

    type IoTData = {
        signature: Text;
        payload: {
            data: Float;
        };
    };

    // Define the Thing type that was missing
    type ThingId = Nat;
    
    type Status = {
        online: Bool;
        lastSeen: Time.Time;
    };

    type Thing = {
        id: ThingId;
        name: Text;
        nonce: Text;
        endpoint: Text;
        status: Status;
    };

    // Define interfaces for external canisters
    type DataStorage = actor {
        storeData: shared (Nat, Float) -> async Bool;
    };

    type UserThings = actor {
        getUserThings: shared query () -> async [Thing];
    };

    // External canister references
    let dataStorage : DataStorage = actor("DATASTORAGE-CANISTER-ID");
    let userThings : UserThings = actor("USERTHINGS-CANISTER-ID");

  // **serde Configuration**

    // Define record keys for IoTData to assist serde in serialization/deserialization
    let IoTDataKeys = ["signature", "payload"];

    // Define nested record keys for the payload
    let PayloadKeys = ["data"];

    // **Private Helper Functions**

    /**
     * Parses the URL to extract the Principal and Device ID.
     * Expected URL format: /api/v1/{principalId}/{deviceId}
     *
     * @param url The URL text to parse.
     * @return An optional tuple of (Principal, Nat) if parsing is successful, otherwise null.
     */  // Rest of your existing code remains the same...
    private func parseUrl(url: Text) : ?(Principal, Nat) {
        let parts = Text.split(url, #char('/'));
        if (parts.size() != 5) return null;
        
        let principalText = parts[3];
        let deviceIdText = parts[4];
        
        try {
            let principal = Principal.fromText(principalText);
            let deviceId = Nat.fromText(deviceIdText);
            
            switch(deviceId) {
                case null { null };
                case (?id) { ?(principal, id) };
            };
        } catch (e) {
            null
        };
    };

    private func verifySignature(data: IoTData, nonce: Text) : Bool {
        let message = Text.concat(data.signature, nonce); // Use the actual nonce for verification
        let expectedHash = Sha256.fromBlob(#sha256, Text.encodeUtf8(message));
        return Text.equal(data.signature, expectedHash);
        //return true; // Replace with the actual verification logic
    };

    public shared query func http_request(request: HttpRequest) : async HttpResponse {
        if (not Text.equal(request.method, "POST")) {
            return {
                status_code = 405;
                headers = [("Content-Type", "application/json")];
                body = Text.encodeUtf8("{\"error\": \"Method not allowed\"}");
            };
        };

        // Parse the URL to extract Principal and Device ID
        switch (parseUrl(request.url)) {
            case null {
                return {
                    status_code = 400;
                    headers = [("Content-Type", "application/json")];
                    body = Text.encodeUtf8("{\"error\": \"Invalid URL format\"}");
                };
            };
            case (?(principal, deviceId)) {
                try {
                    // Decode the request body from Blob to Text (UTF-8)
                    let jsonTextOpt = Text.decodeUtf8(request.body);
                    
                    switch (jsonTextOpt) {
                        case null {
                            return {
                                status_code = 400;
                                headers = [("Content-Type", "application/json")];
                                body = Text.encodeUtf8("{\"error\": \"Invalid JSON encoding\"}");
                            };
                        };
                        case (?jsonText) {
                            // Deserialize JSON to IoTData using serde
                            let serdeResult = JSON.fromText(jsonText, IoTDataKeys, null);
                            
                            switch (serdeResult) {
                                case (#ok(blob) ){
                                    // Decode the Candid blob to IoTData
                                    let decodeResult = Candid.decode<IoTData>(blob);
                                    
                                    switch (decodeResult) {
                                        case (#ok(iotData)) {
                                            // Optional: Verify the signature (provide a nonce if applicable)
                                            if (not verifySignature(iotData, "")) { // Replace "" with actual nonce if needed
                                                return {
                                                    status_code = 403;
                                                    headers = [("Content-Type", "application/json")];
                                                    body = Text.encodeUtf8("{\"error\": \"Invalid signature\"}");
                                                };
                                            };

                                            // Extract the temperature data from the payload
                                            let temperature = iotData.payload.data;

                                            // Store data using the DataStorage canister
                                            let success = await dataStorage.storeData(deviceId, temperature);
                                            
                                            if (success) {
                                                return {
                                                    status_code = 200;
                                                    headers = [("Content-Type", "application/json")];
                                                    body = Text.encodeUtf8("{\"status\": \"success\"}");
                                                };
                                            } else {
                                                return {
                                                    status_code = 500;
                                                    headers = [("Content-Type", "application/json")];
                                                    body = Text.encodeUtf8("{\"error\": \"Failed to store data\"}");
                                                };
                                            };
                                        };
                                        case (#err(_)) {
                                            return {
                                                status_code = 400;
                                                headers = [("Content-Type", "application/json")];
                                                body = Text.encodeUtf8("{\"error\": \"Invalid payload format\"}");
                                            };
                                        };
                                    };
                                };
                                case (#err(_)) {
                                    return {
                                        status_code = 400;
                                        headers = [("Content-Type", "application/json")];
                                        body = Text.encodeUtf8("{\"error\": \"Failed to parse JSON\"}");
                                    };
                                };
                            };
                        };
                    };
                } catch (e) {
                    return {
                        status_code = 500;
                        headers = [("Content-Type", "application/json")];
                        body = Text.encodeUtf8("{\"error\": \"Internal server error\"}");
                    };
                };
            };
        };
    };
}
