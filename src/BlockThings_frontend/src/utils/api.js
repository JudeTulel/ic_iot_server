// Import necessary modules from the @dfinity/agent package
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/BlockThings_backend/BlockThings_backend.did';

// Determine the network and canister ID based on environment variables
const network = process.env.REACT_APP_DFX_NETWORK;
const canisterId = network === 'local'
  ? process.env.REACT_APP_LOCAL_CANISTER_ID
  : process.env.REACT_APP_PROD_CANISTER_ID;

// Initialize the agent to interact with the Internet Computer
const agent = new HttpAgent({ host: network === 'local' ? 'http://localhost:8000' : 'https://ic0.app' });

// Create the canister actor based on the .did.js IDL factory and canister ID
const canisterActor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

// Export all the functions that can be used from React

// Register a new Thing (device)
export async function registerThing(name) {
  try {
    const result = await canisterActor.registerThing(name);
    return result; // This returns the Thing object with its ID, status, endpoint, etc.
  } catch (error) {
    console.error("Error registering thing:", error);
    throw error;
  }
}

// Retrieve all things (devices) owned by the user
export async function getUserThings() {
  try {
    const result = await canisterActor.getUserThings();
    return result; // Returns an array of Thing objects
  } catch (error) {
    console.error("Error getting user things:", error);
    throw error;
  }
}

// Retrieve data for a specific thing (device) by ThingId
export async function getThingData(thingId) {
  try {
    const result = await canisterActor.getThingData(thingId);
    return result; // Returns an array of DataEntry objects { value, timestamp }
  } catch (error) {
    console.error("Error getting thing data:", error);
    throw error;
  }
}

// Retrieve data for a specific thing (device) within a time range
export async function getThingDataInRange(thingId, fromTime, toTime) {
  try {
    const result = await canisterActor.getThingDataInRange(thingId, fromTime, toTime);
    return result; // Returns an array of DataEntry objects { value, timestamp }
  } catch (error) {
    console.error("Error getting thing data in range:", error);
    throw error;
  }
}

// Store data for a specific thing (device)
export async function storeThingData(thingId, value) {
  try {
    const result = await canisterActor.storeThingData(thingId, value);
    return result; // Returns a boolean indicating success
  } catch (error) {
    console.error("Error storing thing data:", error);
    throw error;
  }
}

// Rename a thing (device) by ThingId
export async function renameThing(thingId, newName) {
  try {
    const result = await canisterActor.renameThing(thingId, newName);
    return result; // Returns a boolean indicating success
  } catch (error) {
    console.error("Error renaming thing:", error);
    throw error;
  }
}

// Mark a thing (device) as online by ThingId
export async function markThingOnline(thingId) {
  try {
    const result = await canisterActor.markThingOnline(thingId);
    return result; // Returns a boolean indicating success
  } catch (error) {
    console.error("Error marking thing online:", error);
    throw error;
  }
}

// Remove a thing (device) by ThingId
export async function removeThing(thingId) {
  try {
    const result = await canisterActor.removeThing(thingId);
    return result; // Returns a boolean indicating success
  } catch (error) {
    console.error("Error removing thing:", error);
    throw error;
  }
}
