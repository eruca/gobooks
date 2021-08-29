import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType } from 'typesafe-actions';
import request from 'umi-request';

import { IServerAction } from '../types/network';
import { IAction } from '@/types/action';
import { onHttpServer } from '@/types/network';
import { httpAddr } from '@/settings';
import { dispatch_action_from_server } from './base';

// 在http的情况下，可以设置meta:timeout, 如果超过该时间就取消发送, 但是目前在typescript类型中未支持
// 其他信息见websocket.ts
const http: Middleware =
    ({ dispatch }: MiddlewareAPI) =>
    (next: Dispatch<AnyAction>) =>
    async (action: IAction) => {
        console.log('Console call: type', action.type, action);

        if (action.type === getType(onHttpServer)) {
            // 将内部的数据拿出来，type:url, 直接fetch,返回取消器
            const { type, payload } = action.payload;
            const httpUrl = `${httpAddr}/${type}`;

            const server_action: IServerAction = await request(httpUrl, {
                method: 'POST',
                data: payload,
                requestType: 'json',
            });

            dispatch_action_from_server(dispatch, server_action, action.meta);
            return;
        }

        return next(action);
    };

export default http;
