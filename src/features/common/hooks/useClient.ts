import { useEffect, useState } from 'react';

function useClient() {
  const [client, setClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClient(true);
    }
  }, []);

  return client;
}

export default useClient;
