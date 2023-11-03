import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {api} from "../shared";
import {authSliceReducer} from "../entities";

const rootReducer = combineReducers({
  authSliceReducer,
  [api.reducerPath]: api.reducer,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false})
            .concat(api.middleware)
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
