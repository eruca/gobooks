import { useState, useCallback } from 'react';

import { columnTableConfig } from '@/pages/Authors/columns';
import { IQuery } from '@/types/base';
import { DEFAULT_QUERY_MODEL } from '@/constants';
import { ITableConfigDataType } from '@/types/table_config';

export type SearchValues = {
    onSearch: boolean;
    values: Record<string, any>;
};

const INIT_SEARCH_PARAMS: SearchValues = {
    onSearch: false,
    values: {},
};

export default function useAuthors() {
    // 默认初始全部选中
    const [columnSelect, setColumnSelect] =
        useState<ITableConfigDataType[]>(columnTableConfig);
    const setDefaultColumnSelect = useCallback(
        () => setColumnSelect(columnTableConfig),
        [columnTableConfig],
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
