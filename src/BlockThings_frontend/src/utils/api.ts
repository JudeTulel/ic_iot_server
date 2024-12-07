import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory }  from '../../../declarations/BlockThings_backend/BlockThings_backend.did'
import type { _SERVICE, Thing as BackendThing } from '../../../declarations/BlockThings_backend/BlockThings_backend.did';

// Frontend Types
export interface Thing {
  id: Principal;
  name: string;
  status: { Online: null } | { Offline: null };
}

export interface DataEntry {
  timestamp: bigint;
  value: number;
}

// Type conversion utilities
const convertThing = (backendThing: BackendThing): Thing => ({
  ...backendThing,
  id: Principal.fromText(backendThing.id.toString()),
  status: backendThing.status.online ? { Online: null } : { Offline: null }
});

const convertThingId = (principal: Principal): bigint => {
  return BigInt(principal.toString());
};

// Configuration
const localNetwork = "http://localhost:4943";
const icNetwork = "https://ic0.app";

// Get canister IDs from vite environment variables
const canisterId = import.meta.env.VITE_BLOCKTHINGS_BACKEND_CANISTER_ID;
const isLocal = import.meta.env.VITE_DFX_NETWORK === "local";

// Initialize the agent and actor
const agent = new HttpAgent({
  host: isLocal ? localNetwork : icNetwork
});

// Only perform this step if in local development
if (isLocal) {
  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });
}

// Create the actor
const actor = Actor.createActor<_SERVICE>(idlFactory, {
  agent,
  canisterId,
});

// API Functions
export const api = {
  async registerThing(name: string): Promise<Thing> {
    try {
      const result = await actor.registerThing(name);
      return convertThing(result);
    } catch (error) {
      console.error("Error registering thing:", error);
      throw error;
    }
  },

  async getUserThings(): Promise<Thing[]> {
    try {
      const results = await actor.getUserThings();
      return results.map(convertThing);
    } catch (error) {
      console.error("Error getting user things:", error);
      throw error;
    }
  },

  async getThingData(thingId: Principal): Promise<DataEntry[]> {
    try {
      return await actor.getThingData(convertThingId(thingId));
    } catch (error) {
      console.error("Error getting thing data:", error);
      throw error;
    }
  },

  async getThingDataInRange(
    thingId: Principal,
    fromTime: bigint,
    toTime: bigint
  ): Promise<DataEntry[]> {
    try {
      return await actor.getThingDataInRange(
        convertThingId(thingId),
        fromTime,
        toTime
      );
    } catch (error) {
      console.error("Error getting thing data in range:", error);
      throw error;
    }
  },

  async storeThingData(thingId: Principal, value: number): Promise<boolean> {
    try {
      return await actor.storeThingData(convertThingId(thingId), value);
    } catch (error) {
      console.error("Error storing thing data:", error);
      throw error;
    }
  },

  async renameThing(thingId: Principal, newName: string): Promise<boolean> {
    try {
      return await actor.renameThing(convertThingId(thingId), newName);
    } catch (error) {
      console.error("Error renaming thing:", error);
      throw error;
    }
  },

  async markThingOnline(thingId: Principal): Promise<boolean> {
    try {
      return await actor.markThingOnline(convertThingId(thingId));
    } catch (error) {
      console.error("Error marking thing online:", error);
      throw error;
    }
  },

  async removeThing(thingId: Principal): Promise<boolean> {
    try {
      return await actor.removeThing(convertThingId(thingId));
    } catch (error) {
      console.error("Error removing thing:", error);
      throw error;
    }
  }
};