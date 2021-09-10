import { useSelector, useDispatch } from 'react-redux';

import RootState from '@/models';
import { IDict } from '@/types/dicts';
import { dicts_delete } from '@/types/dicts';
import { Page, IPage } from '@/components/Pages';
import { dicts_fetch } from '@/types/settings';
import { buttonArrayProps } from './columns';

export default function Dicts() {
    const dispatch = useDispatch();
    const {
        dicts,
        users: {
            pess_locktables,
            loginer: {
                token,
                user: { role },
            },
        },
    } = useSelector((states: RootState) => states);

    const pageProps: IPage<IDict> = {
        title: '词典',
        model: 'useDicts',
        dispatch,
        pess_locktables,
        dicts: dicts.data,
        data: dicts.data,
        token,
        buttonArrayProps,
        delete_action: dicts_delete,
    };

    return <Page {...pageProps} />;
}
