// hooks/usePlug.js
import { useState, useEffect, useCallback } from 'react';

export const usePlug = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [principalId, setPrincipalId] = useState(null);
  const [actor, setActor] = useState(null);

  const checkConnection = useCallback(async () => {
    try {
      const connected = await window.ic?.plug?.isConnected();
      setIsConnected(connected);
      if (connected) {
        const principal = await window.ic.plug.agent.getPrincipal();
        setPrincipalId(principal.toText());
      }
    } catch (error) {
      console.error('Failed to check Plug connection:', error);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      if (!window.ic?.plug) {
        window.open('https://plugwallet.ooo/', '_blank');
        return;
      }

      const connected = await window.ic.plug.requestConnect(plugConnection);
      if (connected) {
        await checkConnection();
        
        // Create actor
        const mainActor = await window.ic.plug.createActor({
          canisterId: process.env.REACT_APP_MAIN_CANISTER_ID,
          interfaceFactory: mainIDL,
        });
        
        setActor(mainActor);
      }
    } catch (error) {
      console.error('Failed to connect to Plug wallet:', error);
    }
  }, [checkConnection]);

  const disconnect = useCallback(async () => {
    try {
      await window.ic?.plug?.disconnect();
      setIsConnected(false);
      setPrincipalId(null);
      setActor(null);
    } catch (error) {
      console.error('Failed to disconnect from Plug wallet:', error);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    principalId,
    actor,
    connect,
    disconnect
  };
};
