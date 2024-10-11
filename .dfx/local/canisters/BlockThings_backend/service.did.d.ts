import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface DataEntry { 'value' : number, 'timestamp' : Time }
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'status_code' : number,
}
export interface Main {
  'getThingData' : ActorMethod<[ThingId], Array<DataEntry>>,
  'getThingDataInRange' : ActorMethod<[ThingId, Time, Time], Array<DataEntry>>,
  'getUserThings' : ActorMethod<[], Array<Thing>>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'init' : ActorMethod<[], undefined>,
  'markThingOnline' : ActorMethod<[ThingId], boolean>,
  'registerThing' : ActorMethod<[string], Thing>,
  'removeThing' : ActorMethod<[ThingId], boolean>,
  'renameThing' : ActorMethod<[ThingId, string], boolean>,
  'storeThingData' : ActorMethod<[ThingId, number], boolean>,
}
export interface Status { 'lastSeen' : Time, 'online' : boolean }
export interface Thing {
  'id' : ThingId,
  'status' : Status,
  'endpoint' : string,
  'name' : string,
  'nonce' : string,
}
export type ThingId = bigint;
export type Time = bigint;
export interface _SERVICE extends Main {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
