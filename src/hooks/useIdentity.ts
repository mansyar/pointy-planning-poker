import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const STORAGE_KEYS = {
  IDENTITY_ID: 'pointy_identityId',
  NICKNAME: 'pointy_nickname',
};

// Helper to generate a UUID if not in secure context or for older browsers
function simpleUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useIdentity() {
  // Initialize with empty/null for SSR stability
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [nickname, setNicknameState] = useState<string>('');
  const verifySyncToken = useMutation(api.sync.verify);

  useEffect(() => {
    // Client-side initialization
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const syncToken = urlParams.get('sync');

      if (syncToken) {
        verifySyncToken({ token: syncToken })
          .then((syncedId) => {
            localStorage.setItem(STORAGE_KEYS.IDENTITY_ID, syncedId);
            localStorage.setItem('pointy_isController', 'true');
            setIdentityId(syncedId);
            // Clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          })
          .catch((err) => {
            console.error('Failed to sync identity:', err);
            // Fallback to local identity
            let id = localStorage.getItem(STORAGE_KEYS.IDENTITY_ID);
            if (!id) {
              id = simpleUUID();
              localStorage.setItem(STORAGE_KEYS.IDENTITY_ID, id);
            }
            setIdentityId(id);
          });
      } else {
        let id = localStorage.getItem(STORAGE_KEYS.IDENTITY_ID);
        if (!id) {
          id = simpleUUID();
          localStorage.setItem(STORAGE_KEYS.IDENTITY_ID, id);
        }
        setIdentityId(id);
      }

      const name = localStorage.getItem(STORAGE_KEYS.NICKNAME) || '';
      setNicknameState(name);
    }
  }, [verifySyncToken]);

  const setNickname = (newNickname: string) => {
    setNicknameState(newNickname);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, newNickname);
    }
  };

  return {
    identityId,
    nickname,
    setNickname,
  };
}
