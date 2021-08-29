import { useMemo, useState, useEffect } from 'react';
import { Table, PageHeader, Button } from 'antd';
import {
    SettingOutlined,
    UserAddOutlined,
    ClearOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { Dispatch, AnyAction } from 'redux';

import { build_conditions } from '@/utils/build_condition';
import { IDict } from '@/models/dicts/dicts';
import styles from './styles.less';
import {
    ButtonArrayHooks,
    DeleteAction,
    FetchAction,
    IButtonArrayProps,
} from '@/components/Pages/hooks';
import { UseModels } from '@/types/models';
import { IKey } from '@/types/base';

export interface IPage<T extends IKey> {
    title: string;
    subtitle?: string;

    dispatch: Dispatch<AnyAction>;
    model: UseModels;
    token: string;

    buttonArrayProps: IButtonArrayProps<T>;
    dicts: IDict[];
    pess_locktables: Set<string>;

    data: T[];
    fetch_action: FetchAction;
    delete_action: DeleteAction;
}

export function Page<T extends IKey>({
    title,
    subtitle,
    model,
    dispatch,
    token,
    buttonArrayProps,
    dicts,
    pess_locktables,
    data,
    fetch_action,
    delete_action,
}: IPage<T>) {
    const {
        searchValues,
        queryModel,
        columnSelect,
        setQueryModel,
        setDefaultSearchValues,
        setDefaultQueryModel,
    } = useModel(model);

    const [incr, setIncr] = useState<number>(0);

    useEffect(() => {
        const conds: string[] = [];
        build_conditions(conds, searchValues.values);
        fetch_action(dispatch, token, {
            ...queryModel,
            conds,
        });
    }, [incr, queryModel, searchValues.values, token]);

    const { onNew, onSearch, onTableConfig, onClear, columns } =
        ButtonArrayHooks({
            ...buttonArrayProps,
            token,
            dicts,
            pess_locktables,
            dispatch,
            setIncr,
            setDefaultQueryModel,
            setDefaultSearchValues,
            delete_action,
            columnSelect,
        });

    const dataSource = useMemo(() => {
        return data.map((tag: T, i: number) => ({
            ...tag,
            seq: i + 1,
            created_at: dayjs(tag.created_at),
            updated_at: dayjs(tag.updated_at),
        }));
    }, [data, searchValues.onSearch, searchValues.values]);

    return (
        <div>
            <PageHeader
                className={styles.page_header}
                title={title}
                subTitle={subtitle}
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
    );
}
