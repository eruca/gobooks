import { createAsyncAction } from 'typesafe-actions';
import { AnyAction, Dispatch } from 'redux';

import { IDict } from '@/models/dicts/dicts';
import { IQuery, IToken } from '@/types/base';
import { onServerRequest } from './network';

export const DICTS_FETCH = 'dicts/fetch';
export const DICTS_FETCH_SUCCESS = 'dicts/fetch_success';
export const DICTS_FETCH_FAILURE = 'dicts/fetch_failure';

export const DICTS_INSERT = 'dicts/insert';
export const DICTS_INSERT_SUCCESS = 'dicts/insert_success';
export const DICTS_INSERT_FAILURE = 'dicts/insert_failure';

export const DICTS_UPDATE = 'dicts/update';
export const DICTS_UPDATE_SUCCESS = 'dicts/update_success';
export const DICTS_UPDATE_FAILURE = 'dicts/update_failure';

export const DICTS_DELETE = 'dicts/delete';
export const DICTS_DELETE_SUCCESS = 'dicts/delete_success';
export const DICTS_DELETE_FAILURE = 'dicts/delete_failure';

export const DictsFetch = createAsyncAction(
    DICTS_FETCH,
    DICTS_FETCH_SUCCESS,
    DICTS_FETCH_FAILURE,
)<Partial<IQuery> & IToken, IDict[], { err: string }>();

export const DictsInsert = createAsyncAction(
    DICTS_INSERT,
    DICTS_INSERT_SUCCESS,
    DICTS_INSERT_FAILURE,
)<IDict & IToken, { msg: string }, { err: string }>();

export const DictsUpdate = createAsyncAction(
    DICTS_UPDATE,
    DICTS_UPDATE_SUCCESS,
    DICTS_UPDATE_FAILURE,
)<IDict & IToken, { msg: string }, { err: string }>();

export const DictsDelete = createAsyncAction(
    DICTS_DELETE,
    DICTS_DELETE_SUCCESS,
    DICTS_DELETE_FAILURE,
)<{ id: number; version: number } & IToken, { msg: string }, { err: string }>();

export function dicts_fetch(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params?: Partial<IQuery>,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            DictsFetch.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function dicts_insert(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IDict,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            DictsInsert.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function dicts_update(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IDict,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            DictsUpdate.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function dicts_delete(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: { id: number; version: number },
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            DictsDelete.request({ ...params, token }),
            success,
            fail,
        ),
    );
}
