import { useMemo, useCallback, useEffect, useState } from 'react';
import { Table, PageHeader, Button } from 'antd';
import {
    SettingOutlined,
    ClearOutlined,
    SearchOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { useModel, Redirect, IUser } from 'umi';
import { useSelector, useDispatch } from 'react-redux';

import RootState from '@/models';
import { users_fetch, users_delete } from '@/types/users';
import { columnsDef } from './columns';
import { pess_lock, pess_unlock } from '@/types/pessimistic_lock';
import { build_conditions } from '@/utils/build_condition';
import styles from './styles.less';
import ActionColumn from '@/components/ActionColumn';

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
    } = useSelector((states: RootState) => states);

    const { setVisible, setDrawerComponent, onOpen, closable, setClosable } =
        useModel('useDrawer');
    const {
        columnSelect,
        queryModel,
        setQueryModel,
        setDefaultQueryModel,
        searchValues,
        setDefaultSearchValues,
    } = useModel('useUsers');

    const [incr, setIncr] = useState<number>(0);

    useEffect(() => {
        const conds: string[] = [];
        build_conditions(conds, searchValues.values);
        users_fetch(dispatch, token, {
            ...queryModel,
            conds: [...conds, `privilege <= ${privilege}`],
        });
    }, [incr, queryModel, searchValues.values, privilege, token]);

    const onNew = useCallback(
        () =>
            onOpen({
                title: '注册用户',
                component: 'UsersNewForm',
                width: 460,
                // setIncr 可以在更新后触发新的服务器请求
                props: { setIncr },
            }),
        [onOpen],
    );

    const onTableConfig = useCallback(() => {
        onOpen({
            title: '设置表格',
            component: 'UsersTableConfig',
            width: 450,
            props: { dataSource: columnsDef },
        });
    }, [onOpen]);

    const onSearch = useCallback(() => {
        onOpen({
            title: '搜索用户',
            component: 'UsersSearch',
            width: 580,
            props: {},
        });
    }, [onOpen]);

    const onClear = useCallback(() => {
        setDefaultSearchValues();
        setDefaultQueryModel();
    }, [token]);

    // 根据Table列配置来重新生成columns
    const columns = useMemo(() => {
        const columnSelected = columnSelect
            .filter((col) => col.selected)
            .map((col) => col.key);
        const columns = columnsDef.filter((col) =>
            columnSelected.includes(col.key),
        );

        const onModify = (record: IUser) => () => {
            setDrawerComponent({
                title: '修改用户',
                component: 'UsersNewForm',
                width: 480,
                props: { ...record, setIncr },
            });
            // 如果开启了悲观锁，则需获取锁，否则直接打开
            if (pess_locktables.has('users')) {
                pess_lock(
                    dispatch,
                    token,
                    {
                        table_name: 'users',
                        id: record.id,
                    },
                    () => {
                        setVisible(true);
                        setClosable({
                            close: () =>
                                pess_unlock(dispatch, token, {
                                    table_name: 'users',
                                    id: record.id,
                                }),
                        });
                    },
                );
            } else {
                setVisible(true);
            }
        };

        const onDelete = (record: IUser) => () => {
            users_delete(
                dispatch,
                token,
                {
                    id: record.id,
                    version: record.version,
                },
                () => setIncr((incr) => incr + 1),
            );
        };

        columns.push({
            title: '操作',
            key: 'action',
            width: '50px',
            // @ts-ignore
            render: (record: IUser) => (
                <ActionColumn
                    name={record.name}
                    onModify={onModify(record)}
                    onDelete={onDelete(record)}
                />
            ),
        });
        return columns;
    }, [columnsDef, columnSelect]);

    const dataSource = useMemo(() => {
        return data
            .filter((user) => user.privilege <= privilege)
            .map((record, i) => ({
                ...record,
                seq: i + queryModel.offset + 1,
            }));
    }, [data, queryModel.offset, privilege]);

    return true ? (
        <div>
            <PageHeader
                className={styles.page_header}
                title="用户"
                subTitle="按最新排序"
                extra={[
                    <Button
                        key={0}
                        type="primary"
                        onClick={onNew}
                        icon={<UserAddOutlined />}
                    >
                        新建
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
                        key={2}
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
                // @ts-ignore
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                rowKey="seq"
                className={styles.page_table}
                pagination={{
                    position: ['bottomCenter'],
                    total,
                    showLessItems: true,
                    showSizeChanger: true,
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
