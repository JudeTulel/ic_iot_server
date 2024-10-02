#ifndef BLOCKTHINGS_H
#define BLOCKTHINGS_H
#include <Arduino.h>
#include <WiFiClient.h>

/*
*function to sign message
*/
String signMessage(const String &payload ,const String &nonce);
/*
*Create Json
*/
String createJson(const String &payload,const String &signature);
/*
*send message
*/
bool sendSignedMessage(const String &payload,const String &nonce,const String &host,const String &path,WiFiClient &client);

#endif
