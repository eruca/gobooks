import { useState, useCallback } from 'react';

import { columnsDef } from '@/pages/Dicts/columns';
import { IQuery } from '@/types/base';
import { DEFAULT_QUERY_MODEL } from '@/constants';
import { ITableConfigDataType } from '@/types/table_config';

// 默认初始全部选中
const INIT_COLUMN_SELECT = columnsDef([]).map((col) => ({
    key: col.key,
    title: col.title,
    selected: true,
}));

export type SearchValues = {
    onSearch: boolean;
    values: Record<string, any>;
};

const INIT_SEARCH_PARAMS: SearchValues = {
    onSearch: false,
    values: {},
};

export default function useDicts() {
    const [columnSelect, setColumnSelect] =
        useState<ITableConfigDataType[]>(INIT_COLUMN_SELECT);
    const setDefaultColumnSelect = useCallback(
        () => setColumnSelect(INIT_COLUMN_SELECT),
        [INIT_COLUMN_SELECT],
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
