//Auth via Internet ID
// Authentication.mo

import Principal "mo:base/Principal";

actor Authentication {
    /*
     *get the caller's Principal ID.
     */
    public func getCallerPrincipal() : Principal {
        return msg.caller;
    };
}
