import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Float "mo:base/Float";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Sha256 "mo:sha2/Sha256";
import { JSON } "mo:serde";
import DataStorage "DataStorage";
import UserThings "UserThings";
import Types "Types";

    
   shared ({ caller = creator }) actor class IoTBackend() {
        // Initialize the storage and user things modules
        private var dataStorage : ?DataStorage.DataStorage = null;
        private var userThings : ?UserThings.UserThings = null;

        public shared func initialize(
            ds : DataStorage.DataStorage,
            ut : UserThings.UserThings
        ) : async () {
            dataStorage := ?ds;
            userThings := ?ut;
        };

        private func parseUrl(url : Text) : ?(Principal, Nat) {
            let parts = Iter.toArray(Text.split(url, #char('/')));

            if (parts.size() != 5) {
                return null;
            };

            let principalText = parts[3];
            let deviceIdText = parts[4];

            let principal = Principal.fromText(principalText);
            switch (Nat.fromText(deviceIdText)) {
                case (?deviceId) {
                    ?(principal, deviceId);
                };
                case null {
                    null;
                };
            };
        };

        private func verifySignature(data : Types.IoTData, nonce : Text) : Bool {
            let message = Text.concat(data.signature, nonce);
            let expectedHash = Sha256.fromBlob(#sha256, Text.encodeUtf8(message));

            switch (Text.decodeUtf8(expectedHash)) {
                case null {
                    false;
                };
                case (?expectedHashText) {
                    Text.equal(data.signature, expectedHashText);
                };
            };
        };

        public func http_request(request : Types.HttpRequest) : async Types.HttpResponse {
            if (not Text.equal(request.method, "POST")) {
                return {
                    status_code = 405;
                    headers = [("Content-Type", "application/json")];
                    body = Text.encodeUtf8("{\"error\": \"Method not allowed\"}");
                };
            };

            switch (dataStorage) {
                case null {
                    return {
                        status_code = 500;
                        headers = [("Content-Type", "application/json")];
                        body = Text.encodeUtf8("{\"error\": \"Service not initialized\"}");
                    };
                };
                case (?ds) {
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
                                switch (Text.decodeUtf8(request.body)) {
                                    case null {
                                        return {
                                            status_code = 400;
                                            headers = [("Content-Type", "application/json")];
                                            body = Text.encodeUtf8("{\"error\": \"Invalid JSON encoding\"}");
                                        };
                                    };
                                    case (?jsonText) {
                                        try {
                                            let #ok(fblob) = JSON.fromText(jsonText, null);
                                            let parsed = switch (from_candid(fblob) : ?Types.IoTData) {
                                                case null {
                                                    return {
                                                        status_code = 400;
                                                        headers = [("Content-Type", "application/json")];
                                                        body = Text.encodeUtf8("{\"error\": \"Invalid data format\"}");
                                                    };
                                                };
                                                case (?data) { data };
                                            };
                                            
                                            if (not verifySignature(parsed, "")) {
                                                return {
                                                    status_code = 403;
                                                    headers = [("Content-Type", "application/json")];
                                                    body = Text.encodeUtf8("{\"error\": \"Invalid signature\"}");
                                                };
                                            };

                                            let temperature = parsed.payload.data;
                                            let success = await ds.storeData(deviceId, temperature);

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
                                        } catch (e) {
                                            return {
                                                status_code = 400;
                                                headers = [("Content-Type", "application/json")];
                                                body = Text.encodeUtf8("{\"error\": \"Invalid payload format\"}");
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
            };
        };
    };
