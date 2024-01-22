import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {publicSlice} from './public.ts';
import {userSlice} from './user';
import {api} from '../services';

export const store = configureStore({
    reducer: {
        [publicSlice.name]: publicSlice.reducer,
        [userSlice.name]: userSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['file/upFile/fulfilled', 'file/addAbortion'],
                // Ignore these field paths in all actions
                //ignoredActionPaths: ['meta.arg', 'payload.data'],
                // Ignore these paths in the state
                ignoredPaths: ['file.abortion'],
            },
        })
            .concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
