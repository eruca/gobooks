import { createLogger } from 'redux-logger';
import { message } from 'antd';

import websocket from '@/network/websocket';
import http from '@/network/http';

export const dva = {
    config: {
        onAction: [websocket, http, createLogger()],
        onError(e: Error) {
            message.error(e.message, 3);
        },
    },
};
