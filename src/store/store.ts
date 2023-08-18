import commercetoolseReducer from '../features/commerceTools/CommerceToolsSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    commercetools: commercetoolseReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
