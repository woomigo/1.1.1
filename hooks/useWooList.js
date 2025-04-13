// useWooList.js
import { useEffect, useState } from 'react';
import {
  doc,
  onSnapshot,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const useWooList = (docId) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'itemGroups', docId);

    const unsub = onSnapshot(ref, (snapshot) => {
      setGroup({ id: snapshot.id, ...snapshot.data() });
      setLoading(false);
    });

    return () => unsub();
  }, [docId]);

  const incrementSelected = async (count = 1) => {
    const ref = doc(db, 'itemGroups', docId);

    // makes sure that users can't overwrite each other and can use at the same time
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new Error('Doc does not exist');

      const current = snap.data().itemsSlctd || 0;
      transaction.update(ref, {
        itemsSlctd: current + count,
      });
    });
  };

  return { group, loading, incrementSelected };
};
