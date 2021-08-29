import { createAsyncAction } from 'typesafe-actions';
import { AnyAction, Dispatch } from 'redux';

import { IQuery, IToken } from '@/types/base';
import { onServerRequest } from './network';
import { IAuthor } from '@/models/authors/authors';

export const AUTHORS_FETCH = 'authors/fetch';
export const AUTHORS_FETCH_SUCCESS = 'authors/fetch_success';
export const AUTHORS_FETCH_FAILURE = 'authors/fetch_failure';

export const AUTHORS_INSERT = 'authors/insert';
export const AUTHORS_INSERT_SUCCESS = 'authors/insert_success';
export const AUTHORS_INSERT_FAILURE = 'authors/insert_failure';

export const AUTHORS_UPDATE = 'authors/update';
export const AUTHORS_UPDATE_SUCCESS = 'authors/update_success';
export const AUTHORS_UPDATE_FAILURE = 'authors/update_failure';

export const AUTHORS_DELETE = 'authors/delete';
export const AUTHORS_DELETE_SUCCESS = 'authors/delete_success';
export const AUTHORS_DELETE_FAILURE = 'authors/delete_failure';

export const AuthorsFetch = createAsyncAction(
    AUTHORS_FETCH,
    AUTHORS_FETCH_SUCCESS,
    AUTHORS_FETCH_FAILURE,
)<Partial<IQuery> & IToken, IAuthor[], { err: string }>();

export const AuthorsInsert = createAsyncAction(
    AUTHORS_INSERT,
    AUTHORS_INSERT_SUCCESS,
    AUTHORS_INSERT_FAILURE,
)<IAuthor & IToken, { msg: string }, { err: string }>();

export const AuthorsUpdate = createAsyncAction(
    AUTHORS_UPDATE,
    AUTHORS_UPDATE_SUCCESS,
    AUTHORS_UPDATE_FAILURE,
)<IAuthor & IToken, { msg: string }, { err: string }>();

export const AuthorsDelete = createAsyncAction(
    AUTHORS_DELETE,
    AUTHORS_DELETE_SUCCESS,
    AUTHORS_DELETE_FAILURE,
)<{ id: number; version: number } & IToken, { msg: string }, { err: string }>();

export function authors_fetch(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params?: Partial<IQuery>,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            AuthorsFetch.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function authors_insert(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IAuthor,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            AuthorsInsert.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function authors_update(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IAuthor,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            AuthorsUpdate.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function authors_delete(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: { id: number; version: number },
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            AuthorsDelete.request({ ...params, token }),
            success,
            fail,
        ),
    );
}
