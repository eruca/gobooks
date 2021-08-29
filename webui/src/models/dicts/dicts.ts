import { IAction } from '@/types/action';
import { IDict } from '@/types/dicts';

export interface IDictsState {
    data: IDict[];
}

const INIT_STATE: IDictsState = {
    data: [],
};

export default {
    namespace: 'dicts',
    state: INIT_STATE,
    reducers: {
        fetch_success: (state = INIT_STATE, action: IAction) => {
            console.log('dicts fetch success =>', action);
            // 如果返回没有payload, 就表示所有数据不变
            if (!action.payload) {
                return state;
            }

            const { list } = action.payload;
            return {
                ...state,
                data: list,
            };
        },
        insert_success: (state = INIT_STATE, action: IAction) => {
            const { data, msg } = action.payload;
            console.log('upsert success', action, msg);
            return {
                ...state,
                data: [data, ...state.data],
            };
        },
        update_success: (state = INIT_STATE, action: IAction) => {
            const { data, msg } = action.payload;
            console.log('upsert success', action, msg);
            const index = state.data.findIndex((dict) => dict.id === data.id);
            if (index < 0) {
                throw new Error(`${data} 不在原数据中`);
            }
            return {
                ...state,
                data: [
                    ...state.data.slice(0, index),
                    { ...state.data[index], ...data },
                    ...state.data.slice(index + 1),
                ],
            };
        },
        delete_success: (state = INIT_STATE, action: IAction) => {
            const { data, msg } = action.payload;
            console.log('delete_success', action, msg);
            const index = state.data.findIndex((dict) => dict.id === data.id);
            if (index < 0) {
                throw new Error(`${data} 不在原数据中`);
            }
            return {
                ...state,
                data: [
                    ...state.data.slice(0, index),
                    ...state.data.slice(index + 1),
                ],
            };
        },
    },
};
