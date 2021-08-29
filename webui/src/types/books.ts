import { IKey } from './base';
import { createAsyncAction } from 'typesafe-actions';
import { AnyAction, Dispatch } from 'redux';

import { IQuery, IToken } from '@/types/base';
import { onServerRequest } from './network';

export const BOOKS_FETCH = 'books/fetch';
export const BOOKS_FETCH_SUCCESS = 'books/fetch_success';
export const BOOKS_FETCH_FAILURE = 'books/fetch_failure';

export const BOOKS_INSERT = 'books/insert';
export const BOOKS_INSERT_SUCCESS = 'books/insert_success';
export const BOOKS_INSERT_FAILURE = 'books/insert_failure';

export const BOOKS_UPDATE = 'books/update';
export const BOOKS_UPDATE_SUCCESS = 'books/update_success';
export const BOOKS_UPDATE_FAILURE = 'books/update_failure';

export const BOOKS_DELETE = 'books/delete';
export const BOOKS_DELETE_SUCCESS = 'books/delete_success';
export const BOOKS_DELETE_FAILURE = 'books/delete_failure';

export interface IBook extends IKey {
    name_chinese?: string;
    name_english?: string;
    isbn: string;
    book_series?: string;
    tags: number[];
    authors_id: number[];
    presses_id: number[];

    price: number;
    pages: number;
    introduction?: string;

    length: number;
    width: number;
    height: number;
    weight: number;

    comment?: string;
}

export const BooksFetch = createAsyncAction(
    BOOKS_FETCH,
    BOOKS_FETCH_SUCCESS,
    BOOKS_FETCH_FAILURE,
)<Partial<IQuery> & IToken, IBook[], { err: string }>();

export const BooksInsert = createAsyncAction(
    BOOKS_INSERT,
    BOOKS_INSERT_SUCCESS,
    BOOKS_INSERT_FAILURE,
)<IBook & IToken, { msg: string }, { err: string }>();

export const BooksUpdate = createAsyncAction(
    BOOKS_UPDATE,
    BOOKS_UPDATE_SUCCESS,
    BOOKS_UPDATE_FAILURE,
)<IBook & IToken, { msg: string }, { err: string }>();

export const BooksDelete = createAsyncAction(
    BOOKS_DELETE,
    BOOKS_DELETE_SUCCESS,
    BOOKS_DELETE_FAILURE,
)<{ id: number; version: number } & IToken, { msg: string }, { err: string }>();

export function books_fetch(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params?: Partial<IQuery>,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            BooksFetch.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function books_insert(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IBook,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            BooksInsert.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function books_update(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: IBook,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            BooksUpdate.request({ ...params, token }),
            success,
            fail,
        ),
    );
}

export function books_delete(
    dispatch: Dispatch<AnyAction>,
    token: string,
    params: { id: number; version: number },
    success?: (data: any) => void,
    fail?: (data: any) => void,
) {
    dispatch(
        onServerRequest(
            'websocket',
            BooksDelete.request({ ...params, token }),
            success,
            fail,
        ),
    );
}
