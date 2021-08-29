import { WEBSOCKET_REQUEST, ICallback, HTTP_REQUEST, Actions } from './base';
import { createAction } from 'typesafe-actions';

export interface IServerAction {
    type: string;
    payload: Record<string, any>;
    uuid?: string;
    token: string;
}

export const onWebsocketServer = createAction(WEBSOCKET_REQUEST)<
    Actions,
    ICallback | undefined
>();

export const onHttpServer = createAction(HTTP_REQUEST)<
    Actions,
    ICallback | undefined
>();

export const onServerRequest = (
    type: 'http' | 'websocket',
    actions: Actions,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) => {
    const fn = type === 'http' ? onHttpServer : onWebsocketServer;
    return fn(actions, success || fail ? { success, fail } : undefined);
};
