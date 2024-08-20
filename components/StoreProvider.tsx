'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, store } from '@/lib/redux/configureStore';
import { PersistGate } from 'redux-persist/integration/react';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate loading={null} persistor={store.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
