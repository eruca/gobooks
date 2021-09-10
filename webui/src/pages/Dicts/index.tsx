import { useMemo, useCallback } from 'react';
import { Table, PageHeader, Button } from 'antd';
import {
    SettingOutlined,
    UserAddOutlined,
    ClearOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useModel, Redirect } from 'umi';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';

import RootState from '@/models';
import { IDict } from '@/types/dicts';
import { dicts_delete } from '@/types/dicts';
import { columnsDef } from './columns';
import styles from './styles.less';
import { pess_lock, pess_unlock } from '@/types/pessimistic_lock';

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

    const { onOpen, setDrawerComponent, setVisible, setClosable } =
        useModel('useDrawer');
    const {
        searchValues,
        columnSelect,
        queryModel,
        setQueryModel,
        setDefaultSearchValues,
        setDefaultQueryModel,
    } = useModel('useDicts');

    const onNew = useCallback(
        () =>
            onOpen({
                title: '注册字典',
                component: 'DictsNewForm',
                width: 620,
                // 可以在搜索时，新增可以默认同一类category,不在搜索时默认是null，所以不影响
                props: { category: searchValues.values['category'] },
            } as IDrawerComponent<IDict>),
        [onOpen, searchValues.values['category']],
    );

    const onTableConfig = useCallback(
        () =>
            onOpen({
                title: '设置表格',
                component: 'DictsTableConfig',
                width: 450,
                props: { dataSource: columnsDef([]) },
            }),
        [onOpen, columnsDef],
    );

    const onSearch = useCallback(
        () =>
            onOpen({
                title: '搜索字典',
                component: 'DictsSearch',
                width: 720,
                props: {},
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
        const columns = columnsDef(dicts.data).filter((col) =>
            columnSelected.includes(col.key),
        );

        // 需要首选注入record,下同
        const onModify = (record: IDict) => () => {
            setDrawerComponent({
                title: '修改标签',
                component: 'DictsNewForm',
                width: 720,
                props: record,
            });
            if (pess_locktables.has('dicts')) {
                pess_lock(
                    dispatch,
                    token,
                    {
                        table_name: 'dicts',
                        id: record.id,
                    },
                    () => {
                        setVisible(true);
                        setClosable({
                            close: () =>
                                pess_unlock(dispatch, token, {
                                    table_name: 'dicts',
                                    id: record.id,
                                }),
                        });
                    },
                );
            } else {
                setVisible(true);
            }
        };

        const onDelete = (record: IDict) => () => {
            dicts_delete(dispatch, token, {
                id: record.id,
                version: record.version,
            });
        };

        columns.push({
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: '200px',
            // @ts-ignore
            render: (record: IDict) => (
                <ActionColumn
                    name={record.name}
                    onModify={onModify(record)}
                    onDelete={onDelete(record)}
                />
            ),
        });
        return columns;
    }, [dicts.data, columnSelect, searchValues, columnsDef]);

    const dataSource = useMemo(() => {
        let data = dicts.data;
        if (searchValues.onSearch) {
            for (const [k, v] of Object.entries(searchValues.values)) {
                if (v) {
                    console.log(`key:${k}, value:${v}`, typeof v);
                    if (k === 'tags' && Array.isArray(v) && v.length > 0) {
                        for (const v1 of v) {
                            data = data.filter((item) =>
                                item.tags?.some((tag) => tag === v1),
                            );
                        }
                    } else {
                        // @ts-ignore
                        data = data.filter((item) => item[k] === v);
                    }
                }
            }
        }
        return data.map((tag: IDict, i: number) => ({
            ...tag,
            seq: i + 1,
            created_at: dayjs(tag.created_at),
            updated_at: dayjs(tag.updated_at),
        }));
    }, [dicts, searchValues.onSearch, searchValues.values]);

    return role == 0 ? (
        <div>
            <PageHeader
                className={styles.page_header}
                title="字典"
                subTitle="按最新排序"
                extra={[
                    <Button
                        key={2}
                        type="primary"
                        onClick={onNew}
                        icon={<UserAddOutlined />}
                    >
                        新增
                    </Button>,
                    <Button
                        key={1}
                        type="primary"
                        onClick={onTableConfig}
                        icon={<SettingOutlined />}
                    >
                        配置
                    </Button>,
                    <Button
                        key={0}
                        type="primary"
                        onClick={onSearch}
                        icon={<SearchOutlined />}
                    >
                        搜索
                    </Button>,
                    <Button
                        key={3}
                        type="primary"
                        danger
                        onClick={onClear}
                        icon={<ClearOutlined />}
                        disabled={!searchValues.onSearch}
                    >
                        清除
                    </Button>,
                ]}
            />
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                rowKey="seq"
                className={styles.page_table}
                pagination={{
                    position: ['bottomCenter'],
                    total: dataSource.length,
                    showLessItems: true,
                    current:
                        Math.floor(queryModel.offset / queryModel.size) + 1,
                    pageSize: queryModel.size,
                    showTotal: (total: number, range: [number, number]) =>
                        `当前 ${range[0]}-${range[1]} : 共${total}条`,
                    onChange: (page: number, pageSize?: number) => {
                        const query = {
                            ...queryModel,
                            size: pageSize || queryModel.size,
                            offset: (page - 1) * queryModel.size,
                        };
                        setQueryModel(query);
                    },
                }}
            />
        </div>
    ) : (
        <Redirect to="/" />
    );
}
