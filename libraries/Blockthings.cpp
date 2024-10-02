#include "Blockthings.h"
#include <SHA256.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

/*
 * Message Signing
 */
String signMessage(const String &payload, const String &nonce) {
  String dataToSign = payload + nonce;
  SHA256 sha256;
  
  // Perform SHA-256 hashing
  sha256.update(reinterpret_cast<const uint8_t*>(dataToSign.c_str()), dataToSign.length());
  uint8_t *hash = sha256.result();

  // Convert the hash to a hexadecimal string
  String signature;
  signature.reserve(64); // Reserve space to improve performance

  for (int i = 0; i < 32; i++) {
    if (hash[i] < 0x10) {
      signature += "0";
    }
    signature += String(hash[i], HEX);
  }

  signature.toLowerCase(); // Ensure the signature is in lowercase
  return signature;
}

/*
 * Create JSON
 */
String createJson(const String &payload, const String &signature) {
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["payload"] = payload;
  jsonDoc["signature"] = signature;

  String jsonString;
  serializeJson(jsonDoc, jsonString);
  
  return jsonString;
}

/*
 * Send Signed Message
 */
bool sendSignedMessage(const String &payload, const String &nonce, 
                       const String &host, const String &path, 
                       WiFiClient &client) {
  HTTPClient http;

  // Sign the payload
  String signature = signMessage(payload, nonce);

  // Create JSON using the createJson function
  String jsonPayload = createJson(payload, signature);

  // Construct the full URL begins with http
  String fullUrl = host + path;

  // Begin HTTP connection
  if (!http.begin(client, fullUrl)) {
    Serial.println("Failed to connect to the host.");
    return false;
  }

  // Add HTTP headers
  http.addHeader("Content-Type", "application/json");

  // Send HTTP POST request
  int httpResponseCode = http.POST(jsonPayload);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  // Free resources
  http.end();

  // Return true if the response code is 200 (OK)
  return (httpResponseCode == 200);
}
