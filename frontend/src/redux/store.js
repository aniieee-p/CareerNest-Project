import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    createTransform,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

// Strip savedJobs when writing to storage — they should not persist across sessions
const jobTransform = createTransform(
    (inboundState) => ({ ...inboundState, savedJobs: [] }),
    (outboundState) => outboundState,
    { whitelist: ['job'] }
)

const persistConfig = {
    key: 'root',
    version: 3,
    storage,
    transforms: [jobTransform],
}

const rootReducer = combineReducers({
    auth:authSlice,
    job:jobSlice,
    company:companySlice,
    application:applicationSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;
