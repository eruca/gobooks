import { IAction } from '@/types/action';
import { IKey } from '@/types/base';

export interface IAuthor extends IKey {
    name_chinese?: string;
    pinyin?: string;
    name_english?: string;
    nationality: string;
    introduction?: string;
}

export const zeroAuthor: IAuthor = {
    id: 0,
    version: 0,
    nationality: '',
    created_at: undefined,
    updated_at: undefined,
};

export interface IAuthorsState {
    data: IAuthor[];
    total: number;
}

const INIT_STATE: IAuthorsState = {
    data: [],
    total: 0,
};

export default {
    namespace: 'authors',
    state: INIT_STATE,
    reducers: {
        fetch_success: (state = INIT_STATE, action: IAction) => {
            console.info('users fetch success =>', action);
            // 如果返回没有payload, 就表示所有数据不变
            if (!action.payload) {
                return state;
            }

            const { list, total } = action.payload;
            return {
                ...state,
                data: list,
                total,
            };
        },
    },
};
