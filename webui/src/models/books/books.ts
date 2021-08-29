import { IBook } from '@/types/books';
import { IAction } from '@/types/action';

export interface IBooksState {
    data: IBook[];
    total: number;
}

const INIT_STATE: IBooksState = {
    data: [],
    total: 0,
};

export default {
    namespace: 'books',
    state: INIT_STATE,
    reducers: {
        fetch_success: (state = INIT_STATE, action: IAction) => {
            console.info('books fetch success =>', action);
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
