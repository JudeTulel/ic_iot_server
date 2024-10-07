import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Sha256 "mo:sha2/Sha256";
import { JSON; Candid; CBOR; UrlEncoded } "mo:serde";
actor IoTBackend {
    // **Type Definitions**

    // Represents an HTTP header field as a tuple of (Text, Text)
    type HeaderField = (Text, Text);

    // Represents an HTTP request structure
    type HttpRequest = {
        method: Text;
        url: Text;
        headers: [HeaderField];
        body: Blob;
    };

    // Represents an HTTP response structure
    type HttpResponse = {
        status_code: Nat16;
        headers: [HeaderField];
        body: Blob;
    };

    // Modified IoTData type with nested payload
    type IoTData = {
        signature: Text;
        payload: {
            data: Float;
        };
    };

    // **External Canister References**

    // Reference to the DataStorage canister for storing IoT data
    let dataStorage = actor "DATASTORAGE-CANISTER-ID" : actor {
        storeData: shared (Nat, Float) -> async Bool;
    };

    // Reference to the UserThings canister (example usage)
    let userThings = actor "USERTHINGS-CANISTER-ID" : actor {
        getUserThings: shared query () -> async [Thing];
    };

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
     */
    private func parseUrl(url: Text) : ?(Principal, Nat) {
        let parts = Text.split(url, #char('/'));
        if (parts.size() != 5) return null; // Expected format: /api/v1/{principalId}/{deviceId}
        
        var principalText = parts[3];
        var deviceIdText = parts[4];
        var principal = Principal.fromText(principalText);
        var deviceId = Nat.fromText(deviceIdText);
        return ?(principal, deviceId);
        
    };

    /**
     * Verifies the signature of the IoT data.
     *
     * @param data The IoTData containing the signature.
     * @param nonce A nonce value used in the signature verification (if applicable).
     * @return True if the signature is valid, otherwise false.
     */
    private func verifySignature(data: IoTData, nonce: Text) : Bool {
        let message = Text.concat(data.signature, nonce); // Use the actual nonce for verification
        let expectedHash = Sha256.fromBlob(#sha256, Text.encodeUtf8(message));
        return Text.equal(data.signature, expectedHash);
    };

    // **Public HTTP Request Handler**

    /**
     * Handles incoming HTTP requests.
     *
     * @param request The HttpRequest object containing method, URL, headers, and body.
     * @return An HttpResponse object with the appropriate status code, headers, and body.
     */
    public shared query func http_request(request: HttpRequest) : async HttpResponse {
        // Ensure the HTTP method is POST
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
