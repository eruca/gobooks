import { SetStateAction, useCallback, Dispatch, useMemo } from 'react';
import { Dispatch as ReduxDispatch, AnyAction } from 'redux';
import { useModel } from 'umi';

import { ITableConfigDataType } from '@/types/table_config';
import { IDict } from '@/models/dicts/dicts';
import {
    NewFormComponents,
    TableConfigComponents,
    SearchComponents,
} from '@/types/models';
import { IKey, IQuery } from '@/types/base';
import ActionColumn from '@/components/ActionColumn';
import { pess_lock, pess_unlock } from '@/types/pessimistic_lock';

export type DeleteAction = (
    dispatch: ReduxDispatch<AnyAction>,
    token: string,
    params: { id: number; version: number },
    success?: (data: any) => void,
    fail?: (data: any) => void,
) => void;

export type FetchAction = (
    dispatch: ReduxDispatch<AnyAction>,
    token: string,
    params?: Partial<IQuery>,
    success?: (data: any) => void,
    fail?: (data: any) => void,
) => void;

export interface IButtonArrayProps<T> {
    table_name: string;

    onNewTitle?: string;
    onNewComponent: NewFormComponents;
    onNewWidth?: number;
    onNewProps?: Partial<T>;

    onTableConfigTitle?: string;
    onTableConfigComponent: TableConfigComponents;
    onTableConfigWidth?: number;

    onSearchTitle?: string;
    onSearchComponent: SearchComponents;
    onSearchWidth?: number;
    onSearchProps?: Partial<T>;

    columnsDef: (dicts: IDict[]) => any;
}

export interface IButtonHooksProps<T> extends IButtonArrayProps<T> {
    setDefaultSearchValues: () => void;
    setDefaultQueryModel: () => void;
    setIncr: Dispatch<SetStateAction<number>>;
    dispatch: ReduxDispatch<AnyAction>;
    pess_locktables: Set<string>;
    delete_action: DeleteAction;
    token: string;
    dicts: IDict[];
    columnSelect: ITableConfigDataType[];
}

export function ButtonArrayHooks<T extends IKey>({
    table_name,

    onNewTitle = `新增${table_name}`,
    onNewComponent,
    onNewWidth = 620,
    onNewProps = {},

    onTableConfigTitle = '设置表格',
    onTableConfigComponent,
    onTableConfigWidth = 450,

    onSearchTitle = `搜索${table_name}`,
    onSearchComponent,
    onSearchWidth = 720,
    onSearchProps = {},

    setDefaultSearchValues,
    setDefaultQueryModel,
    setIncr,
    dispatch,
    delete_action,

    dicts,
    columnsDef,
    columnSelect,
    pess_locktables,
    token,
}: IButtonHooksProps<T>) {
    const { setDrawerComponent, setVisible, setClosable, onOpen } =
        useModel('useDrawer');

    const onNew = useCallback(() => {
        const props = { ...onNewProps, setIncr };
        onOpen({
            title: onNewTitle,
            component: onNewComponent,
            width: onNewWidth,
            // 可以在搜索时，新增可以默认同一类category,不在搜索时默认是null，所以不影响
            props,
        });
    }, [onOpen, setIncr]);

    const onTableConfig = useCallback(
        () =>
            onOpen({
                title: onTableConfigTitle,
                component: onTableConfigComponent,
                width: onTableConfigWidth,
                props: { dataSource: columnSelect } as any,
            }),
        [onOpen, columnSelect],
    );

    const onSearch = useCallback(
        () =>
            onOpen({
                title: onSearchTitle,
                component: onSearchComponent,
                width: onSearchWidth,
                props: onSearchProps,
            }),
        [onOpen],
    );

    const onClear = useCallback(() => {
        setDefaultSearchValues();
        setDefaultQueryModel();
    }, [token]);

    // 根据Table列配置来重新生成columns
    const columns = useMemo(() => {
        const columnSelected = columnSelect
            .filter((col) => col.selected)
            .map((col) => col.key);
        const columns = columnsDef(dicts).filter((col: ITableConfigDataType) =>
            columnSelected.includes(col.key),
        );

        // 需要首选注入record,下同
        const onModify = (record: T) => () => {
            setDrawerComponent({
                title: `修改${table_name}`,
                component: onNewComponent,
                width: onNewWidth,
                props: { ...record, setIncr },
            });
            if (pess_locktables.has(table_name)) {
                pess_lock(
                    dispatch,
                    token,
                    {
                        table_name,
                        id: record.id,
                    },
                    () => {
                        setVisible(true);
                        setClosable({
                            close: () =>
                                pess_unlock(dispatch, token, {
                                    table_name,
                                    id: record.id,
                                }),
                        });
                    },
                );
            } else {
                setVisible(true);
            }
        };

        const onDelete = (record: T) => () => {
            delete_action(
                dispatch,
                token,
                {
                    id: record.id,
                    version: record.version,
                },
                () => setIncr((n) => n + 1),
            );
        };

        columns.push({
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: '200px',
            // @ts-ignore
            render: (record: IAuthor) => (
                <ActionColumn
                    name={
                        record.name ||
                        record.name_chinese ||
                        record.name_english ||
                        'no name'
                    }
                    onModify={onModify(record)}
                    onDelete={onDelete(record)}
                />
            ),
        });
        return columns;
    }, [dicts, columnSelect, setIncr]);

    return { onNew, onSearch, onTableConfig, onClear, columns };
}
