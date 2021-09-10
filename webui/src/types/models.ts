import { useState, useCallback } from 'react';

import { IQuery } from '@/types/base';
import { DEFAULT_QUERY_MODEL } from '@/constants';
import { IColumnSelect } from '@/types/table_config';

export type UseModels = 'useDicts' | 'useUsers' | 'useAuthors' | 'useBooks';

export type NewFormComponents =
    | 'AuthorsNewForm'
    | 'UsersNewForm'
    | 'DictsNewForm'
    | 'BooksNewForm';

export type TableConfigComponents =
    | 'AuthorsTableConfig'
    | 'UsersTableConfig'
    | 'DictsTableConfig'
    | 'BooksTableConfig';

export type SearchComponents =
    | 'AuthorsSearch'
    | 'UsersSearch'
    | 'DictsSearch'
    | 'BooksSearch';

export type SearchValues = {
    onSearch: boolean;
    values: Record<string, any>;
};

const INIT_SEARCH_PARAMS: SearchValues = {
    onSearch: false,
    values: {},
};

export function useBaseModel(colSelect: IColumnSelect[]) {
    // 默认初始全部选中
    const [columnSelect, setColumnSelect] =
        useState<IColumnSelect[]>(colSelect);
    const setDefaultColumnSelect = useCallback(
        () => setColumnSelect(colSelect),
        [colSelect],
    );

    const [queryModel, setQueryModel] = useState<IQuery>(DEFAULT_QUERY_MODEL);
    const setDefaultQueryModel = useCallback(
        () => setQueryModel(DEFAULT_QUERY_MODEL),
        [],
    );

    const [searchValues, setSearchValues] =
        useState<SearchValues>(INIT_SEARCH_PARAMS);

    const setDefaultSearchValues = useCallback(
        () => setSearchValues(INIT_SEARCH_PARAMS),
        [],
    );

    return {
        columnSelect,
        setColumnSelect,
        setDefaultColumnSelect,

        queryModel,
        setQueryModel,
        setDefaultQueryModel,

        searchValues,
        setSearchValues,
        setDefaultSearchValues,
    };
}
