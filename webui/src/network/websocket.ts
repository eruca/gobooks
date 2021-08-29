import ReconnectingWebSocket, {
    Message,
    CloseEvent,
} from 'reconnecting-websocket';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { getType } from 'typesafe-actions';

import { websocketAddr } from '@/settings';
import { IServerAction, onWebsocketServer } from '@/types/network';
import { IAction, Action } from '@/types/action';
import { dispatch_action_from_server } from './base';

interface ActionTrace {
    when: number;
    timer: ReturnType<typeof setTimeout>;
}

const websocket: Middleware = ({ dispatch }: MiddlewareAPI) => {
    // pool 作为callback注册地
    const pool = new Map();

    // websocket 在闭包内建立连接
    const ws = new ReconnectingWebSocket(websocketAddr, undefined, {
        debug: true,
    });
    ws.onmessage = (e: MessageEvent) => {
        if (typeof e.data === 'string') {
            const action = JSON.parse(e.data) as IServerAction;
            console.log('received from websocket:', action);

            let callback = pool.get(action.uuid);
            dispatch_action_from_server(dispatch, action, callback);
            pool.delete(action.uuid);
        }
    };
    ws.onclose = (e: CloseEvent) => {
        console.log('logout');
        dispatch({ type: 'users/logout_success' });
    };

    return (next: Dispatch<AnyAction>) => {
        // const actions_trace = new Map<string, ActionTrace>();

        return (action: IAction) => {
            console.info('type', action);

            if (action.type === getType(onWebsocketServer)) {
                let uuid = '';
                if (action.meta && (action.meta.success || action.meta.fail)) {
                    uuid = uuidv4();
                    pool.set(uuid, action.meta);
                }
                sendToServer(ws, action, uuid);
            } else {
                return next(action);
            }
        };
    };
};

// 将action删除fn,重新构造发送给服务端
function sendToServer(
    ws: ReconnectingWebSocket,
    action: IAction,
    uuid: string,
    // actions_trace: Map<string, ActionTrace>,
): void {
    const { token, ...payload } = action.payload.payload;
    const data: Action = {
        type: action.payload.type,
        payload,
        uuid,
        token,
    };
    console.log('action send to server', action, 'data', data);
    waitForWebsocketReadyToSend(ws, JSON.stringify(data));
    // cancelSameActionShortly(ws, data, actions_trace);
}

const delay = 50; // ms

function cancelSameActionShortly(
    ws: ReconnectingWebSocket,
    action: Action,
    actions_trace: Map<string, ActionTrace>,
) {
    const trace = actions_trace.get(action.type);
    if (!trace) {
        set_timeout(ws, action, actions_trace);
    } else if (trace.when - +new Date() > delay) {
        console.info('clear time out:', trace);
        clearTimeout(trace.timer);
        set_timeout(ws, action, actions_trace);
    } else {
        waitForWebsocketReadyToSend(ws, JSON.stringify(action));
    }
}

function set_timeout(
    ws: ReconnectingWebSocket,
    action: Action,
    actions_trace: Map<string, ActionTrace>,
) {
    const cancel_token = setTimeout(() => {
        waitForWebsocketReadyToSend(ws, JSON.stringify(action));
    }, delay);

    actions_trace.set(action.type, {
        when: +new Date(),
        timer: cancel_token,
    });
}

function waitForWebsocketReadyToSend(ws: ReconnectingWebSocket, msg: Message) {
    setTimeout(() => {
        switch (ws.readyState) {
            case 0:
                waitForWebsocketReadyToSend(ws, msg);
                break;
            case 1:
                ws.send(msg);
                break;
            default:
                console.debug('the websocket is closing or closed');
        }
    }, 50);
}

export default websocket;
