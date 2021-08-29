import { useSelector, useDispatch } from 'react-redux';

import RootState from '@/models';
import { books_fetch, books_delete, IBook } from '@/types/books';
import { buttonArrayProps } from './columns';
import { Page, IPage } from '@/components/Pages';

export default function Books() {
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
        books,
    } = useSelector((states: RootState) => states);

    const pageProps: IPage<IBook> = {
        title: '书本',
        model: 'useBooks',
        dispatch,
        pess_locktables,
        dicts: dicts.data,
        data: books.data,
        token,
        buttonArrayProps,
        fetch_action: books_fetch,
        delete_action: books_delete,
    };

    return <Page {...pageProps} />;
}
