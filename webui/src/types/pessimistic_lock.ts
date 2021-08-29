import { Dispatch, AnyAction } from 'redux';
import { createAsyncAction } from 'typesafe-actions';

import { IToken } from '@/types/base';
import { onServerRequest } from './network';

export const PESS_LOCK = 'pess/lock';
export const PESS_LOCK_SUCCESS = 'pess/lock_success';
export const PESS_LOCK_FAILURE = 'pess/lock_failure';

export interface IPessLock {
    lock: boolean;
}

export interface IPessParam {
    table_name: string;
    id: number;
    user_id?: number;
}

export const PessLock = createAsyncAction(
    PESS_LOCK,
    PESS_LOCK_SUCCESS,
    PESS_LOCK_FAILURE,
)<IPessParam & IPessLock & IToken, { err: string }>();

function pess(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IPessParam,
    lock: boolean,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            PessLock.request({ ...params, token, lock }),
            success,
            fail,
        ),
    );
}

export function pess_lock(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IPessParam,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    pess(dispatch, token, params, true, success, fail);
}

export function pess_unlock(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IPessParam,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    pess(dispatch, token, params, false, success, fail);
}
