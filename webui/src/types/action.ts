import { ICallback } from './base';

export interface IAction {
    type: string;
    payload: Record<string, any>;
    meta?: ICallback;
}

export interface Action {
    type: string;
    payload: Record<string, any>;
    uuid?: string;
    token?: string;
}
