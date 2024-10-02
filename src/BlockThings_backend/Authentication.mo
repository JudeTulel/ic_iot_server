//Auth via Internet ID
// Authentication.mo

import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

public type UserId = Principal; // Alias for clarity


public type User = {
    id: UserId;
    name: Text;
    email: Text;
 };
