import { onServerRequest } from './network';
import { AnyAction, Dispatch } from 'redux';
import { createAsyncAction, PayloadAction } from 'typesafe-actions';

import { DictsDelete, DictsFetch, DictsInsert, DictsUpdate } from './dicts';
import { PessLock } from './pessimistic_lock';
import { ActionType } from 'typesafe-actions';
import {
    USERS_FETCH,
    UserDelete,
    UserFetch,
    UserInsert,
    UserUpdate,
    UserLogin,
    UserLogout,
} from './users';
import {
    AuthorsFetch,
    AuthorsDelete,
    AuthorsInsert,
    AuthorsUpdate,
} from './authors';
import { BooksFetch, BooksDelete, BooksInsert, BooksUpdate } from './books';

// remote server 服务器请求
export const SERVER_REQUEST = 'SERVER_REQUEST';
// http 服务器请求
export const HTTP_REQUEST = 'HTTP_REQUEST';
// websocket 服务器请求
export const WEBSOCKET_REQUEST = 'WEBSOCKET_REQUEST';

export interface IKey {
    id: number;
    created_at?: string;
    updated_at?: string;
    version: number;
}

export interface IQuery {
    offset: number;
    size: number;
    conds: string[];
    orderby: string;
}

export interface IQueryRequest extends IQuery {
    force_updated: boolean;
}

export interface ICallback {
    success?: (data: any) => void;
    fail?: (data: any) => void;
}

export interface IToken {
    token: string;
}

export type Actions =
    | ActionType<typeof UserFetch.request>
    | ActionType<typeof UserDelete.request>
    | ActionType<typeof UserLogin.request>
    | ActionType<typeof UserLogout.request>
    | ActionType<typeof UserInsert.request>
    | ActionType<typeof UserUpdate.request>
    | ActionType<typeof PessLock.request>
    | ActionType<typeof DictsFetch.request>
    | ActionType<typeof DictsInsert.request>
    | ActionType<typeof DictsDelete.request>
    | ActionType<typeof DictsUpdate.request>
    | ActionType<typeof AuthorsFetch.request>
    | ActionType<typeof AuthorsInsert.request>
    | ActionType<typeof AuthorsDelete.request>
    | ActionType<typeof AuthorsUpdate.request>
    | ActionType<typeof BooksFetch.request>
    | ActionType<typeof BooksInsert.request>
    | ActionType<typeof BooksDelete.request>
    | ActionType<typeof BooksUpdate.request>;
