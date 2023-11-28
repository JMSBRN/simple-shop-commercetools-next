import { Action, PreloadedState, ThunkAction, configureStore } from '@reduxjs/toolkit';
import commercetoolseReducer from '../features/commerceTools/CommerceToolsSlice';

export const store = configureStore({
  reducer: {
    commercetools: commercetoolseReducer,
  }
});

export const setupStore = (preloadedState: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      commercetools: commercetoolseReducer,
    },
    preloadedState,
  });
};

export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
