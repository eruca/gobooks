import { useSelector, useDispatch } from 'react-redux';

import RootState from '@/models';
import { authors_fetch, authors_delete } from '@/types/authors';
import { IAuthor } from '@/models/authors/authors';
import { buttonArrayProps } from './columns';
import { Page, IPage } from '@/components/Pages';

export default function Authors() {
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
        authors,
    } = useSelector((states: RootState) => states);

    const pageProps: IPage<IAuthor> = {
        title: '作者',
        model: 'useAuthors',
        dispatch,
        pess_locktables,
        dicts: dicts.data,
        data: authors.data,
        token,
        buttonArrayProps,
        fetch_action: authors_fetch,
        delete_action: authors_delete,
    };

    return <Page {...pageProps} />;
}
