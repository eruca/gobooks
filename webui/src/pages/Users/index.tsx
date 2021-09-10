import { useSelector, useDispatch } from 'react-redux';

import RootState from '@/models';
import { users_fetch, users_delete, IUser } from '@/types/users';
import { IPage, Page } from '@/components/Pages';
import { buttonArrayProps } from './columns';

export default function Users() {
    const dispatch = useDispatch();

    const {
        users: {
            data,
            total,
            pess_locktables,
            loginer: {
                token,
                user: { privilege = 0 },
            },
        },
        dicts,
    } = useSelector((states: RootState) => states);

    const pageProps: IPage<IUser> = {
        title: '词典',
        model: 'useDicts',
        dispatch,
        pess_locktables,
        dicts: dicts.data,
        data: data,
        token,
        buttonArrayProps,
        fetch_action: users_fetch,
        delete_action: users_delete,
    };

    return <Page {...pageProps} />;
}
