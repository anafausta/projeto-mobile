import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Leitura pontual inicial
    NetInfo.fetch().then((estado) => {
      if (estado.isConnected !== null) {
        setOnline(Boolean(estado.isConnected && estado.isInternetReachable !== false));
      }
    });

    // Observando mudanças de rede em tempo real
    const cancelar = NetInfo.addEventListener((estado) => {
      const estaOnline = Boolean(estado.isConnected && estado.isInternetReachable !== false);
      setOnline(estaOnline);
    });

    return () => cancelar();
  }, []);

  return online;
}

export default useOnline;
