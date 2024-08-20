import rootReducer, { RootReducer } from './rootReducer';
import {
  AnyAction,
  configureStore,
  Reducer,
  ReducersMapObject,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const makeConfiguredStore = <T>(reducer: ReducersMapObject<T, AnyAction>) =>
  configureStore<T>({
    reducer,
    middleware: <T>(getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return { store: makeConfiguredStore(rootReducer) };
  } else {
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
      key: 'evol',
      whitelist: ['global'],
      storage,
      stateReconciler: autoMergeLevel2,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store =
      makeConfiguredStore<ReturnType<typeof rootReducer>>(persistedReducer);
    const persistor: any = persistStore(store);

    return { store, persistor };
  }
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
