import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  IDENTITY_ID: 'pointy_identityId',
  NICKNAME: 'pointy_nickname',
};

export function useIdentity() {
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [nickname, setNicknameState] = useState<string>('');

  useEffect(() => {
    // Handle identityId
    let id = localStorage.getItem(STORAGE_KEYS.IDENTITY_ID);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEYS.IDENTITY_ID, id);
    }
    setIdentityId(id);

    // Handle nickname
    const savedNickname = localStorage.getItem(STORAGE_KEYS.NICKNAME);
    if (savedNickname) {
      setNicknameState(savedNickname);
    }
  }, []);

  const setNickname = (newNickname: string) => {
    setNicknameState(newNickname);
    localStorage.setItem(STORAGE_KEYS.NICKNAME, newNickname);
  };

  return {
    identityId,
    nickname,
    setNickname,
  };
}
