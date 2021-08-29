import { AnyAction, Dispatch } from 'redux';
import { notification } from 'antd';

import { IServerAction } from '../types/network';
import { ICallback } from '../types/base';
import { success_end, fail_end } from '@/settings';

// 跳过notification
const skips = ['fetch_success', 'editon_success', 'editoff_success'];

export function dispatch_action_from_server(
    dispatch: Dispatch<AnyAction>,
    action: IServerAction,
    callback?: ICallback,
) {
    dispatch(action);

    if (action.type.endsWith(success_end)) {
        if (callback && callback.success) {
            callback.success(action);
        }

        if (
            !skips.some((skip) => action.type.endsWith(skip)) &&
            action.payload.silence !== true
        ) {
            notification.success({
                message: action.type.replace(/[\/\_]/, ' '),
                description: action.payload.msg,
            });
        }
    } else if (action.type.endsWith(fail_end)) {
        if (callback && callback.fail) {
            callback.fail(action);
        }
        notification.error({
            message: action.type.replace(/[\/\_]/, ' '),
            description: action.payload.err,
        });
    }
}
