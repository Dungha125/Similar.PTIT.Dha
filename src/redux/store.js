import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Import loại lưu trữ bạn muốn sử dụng
import authReducer from './Auth/authSlice';
import {authApi} from './Auth/authServices';
import {departmentApi} from "../services/depart";
import {fileApi} from "../services/file";
import {checkerFileApi} from "../services/fileChecker";
import {userApi} from "../services/user";
import {subjectApi} from "../services/subject";
import {branchApi} from "../services/branch";
import {roleApi} from "../services/role";
import {dashboardApi} from "../services/dashboard";
import {plagiarismApi} from "../services/result";
import {privateCheckLogApi} from "../services/privateCheckLog";

// Cấu hình redux-persist cho auth
const authPersistConfig = {
    key: 'auth', // Key riêng cho auth
    storage,
};


const store = configureStore({
    reducer: {
        auth: persistReducer(authPersistConfig, authReducer),
        [departmentApi.reducerPath]: departmentApi.reducer,
        [fileApi.reducerPath]: fileApi.reducer,
        [checkerFileApi.reducerPath]: checkerFileApi.reducer,
        [plagiarismApi.reducerPath]: plagiarismApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [privateCheckLogApi.reducerPath]: privateCheckLogApi.reducer,
        [subjectApi.reducerPath]: subjectApi.reducer,
        [branchApi.reducerPath]: branchApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [roleApi.reducerPath]: roleApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            authApi.middleware,
            departmentApi.middleware,
            plagiarismApi.middleware,
            fileApi.middleware,
            checkerFileApi.middleware,
            userApi.middleware,
            privateCheckLogApi.middleware,
            subjectApi.middleware,
            roleApi.middleware,
            dashboardApi.middleware,
            branchApi.middleware);
    },
});

const persistor = persistStore(store);

export {persistor};
export default store;