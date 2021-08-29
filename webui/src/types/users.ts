import { createAsyncAction } from 'typesafe-actions';
import { AnyAction, Dispatch } from 'redux';

import { IQuery, IToken, IKey } from '@/types/base';
import { onServerRequest } from './network';
import { pess_lock } from './pessimistic_lock';

export const USERS_FETCH = 'users/fetch';
export const USERS_FETCH_SUCCESS = 'users/fetch_success';
export const USERS_FETCH_FAILURE = 'users/fetch_failure';

export const USERS_LOGIN = 'users/login';
export const USERS_LOGIN_SUCCESS = 'users/login_success';
export const USERS_LOGIN_FAILURE = 'users/login_failure';

export const USERS_LOGOUT = 'users/logout';
export const USERS_LOGOUT_SUCCESS = 'users/logout_success';
export const USERS_LOGOUT_FAILURE = 'users/logout_failure';

export const USERS_INSERT = 'users/insert';
export const USERS_INSERT_SUCCESS = 'users/insert_success';
export const USERS_INSERT_FAILURE = 'users/insert_failure';

export const USERS_UPDATE = 'users/update';
export const USERS_UPDATE_SUCCESS = 'users/update_success';
export const USERS_UPDATE_FAILURE = 'users/update_failure';

export const USERS_DELETE = 'users/delete';
export const USERS_DELETE_SUCCESS = 'users/delete_success';
export const USERS_DELETE_FAILURE = 'users/delete_failure';

export const UserFetch = createAsyncAction(
    USERS_FETCH,
    USERS_FETCH_SUCCESS,
    USERS_FETCH_FAILURE,
)<Partial<IQuery> & IToken, IUser[], { err: string }>();

export const UserInsert = createAsyncAction(
    USERS_INSERT,
    USERS_INSERT_SUCCESS,
    USERS_INSERT_FAILURE,
)<IUser & IToken, { msg: string }, { err: string }>();

export const UserUpdate = createAsyncAction(
    USERS_UPDATE,
    USERS_UPDATE_SUCCESS,
    USERS_UPDATE_FAILURE,
)<IUser & IToken, { msg: string }, { err: string }>();

export const UserDelete = createAsyncAction(
    USERS_DELETE,
    USERS_DELETE_SUCCESS,
    USERS_DELETE_FAILURE,
)<{ id: number; version: number } & IToken, { msg: string }, { err: string }>();

export const UserLogin = createAsyncAction(
    USERS_LOGIN,
    USERS_LOGIN_SUCCESS,
    USERS_LOGIN_FAILURE,
)<{ account: string; password: string }, { msg: string }, { err: string }>();

export const UserLogout = createAsyncAction(
    USERS_LOGOUT,
    USERS_LOGOUT_SUCCESS,
    USERS_LOGOUT_FAILURE,
)<{ id: number } & IToken, { msg: string }, { err: string }>();

export function users_fetch(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params?: Partial<IQuery>,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            UserFetch.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function users_insert(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IUser,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            UserInsert.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function users_update_pess(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IUser,
    user_id?: number,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    pess_lock(
        dispatch,
        token,
        {
            table_name: 'users',
            id: params.id,
            user_id,
        },
        (data: any) => {
            users_update(dispatch, token, params, success, fail);
        },
    );
}

export function users_update(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IUser,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            UserUpdate.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function users_delete(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: { id: number; version: number },
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            UserDelete.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function users_login(
    dispatch: Dispatch<AnyAction>,
    params: { account: string; password: string },
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest('websocket', UserLogin.request(params), success, fail),
    );
}

export function users_logout(
    dispatch: Dispatch<AnyAction>,
    params: { id: number } & IToken,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest('websocket', UserLogout.request(params), success, fail),
    );
}

export interface IUser extends IKey {
    email: string;
    password: string;
    name: string;
    role: number;
    privilege: number;
    settings: Record<string, any>;
}
