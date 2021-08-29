import React, { useCallback, useMemo } from 'react';
import { Table, Button, Space } from 'antd';
import { useModel } from 'umi';

import { ITableConfigDataType, columnDefine } from '@/types/table_config';
import { UseModels } from '@/types/models';

export interface IDataSource {
    dataSource: ITableConfigDataType[];
}

export interface ITableConfigProps extends IDataSource {
    model: UseModels;
    userid: number;
    onSave: (
        columnSelect: ITableConfigDataType[],
        setDefaultColumnSelect?: () => void,
    ) => void;
}

export default function TableConfig({
    dataSource,
    model,
    userid,
    onSave,
}: ITableConfigProps) {
    const { columnSelect, setColumnSelect, setDefaultColumnSelect } =
        useModel(model);

    const selectedRowKeys = useMemo(
        () => columnSelect.filter((col) => col.selected).map((col) => col.key),
        [columnSelect],
    );

    const onChange = useCallback(
        (selectedKeys: React.Key[]) => {
            const cols = dataSource.map((col) => ({
                key: col.key,
                title: col.title,
                selected: selectedKeys.indexOf(col.key) >= 0,
            }));
            console.log('TableConfig', selectedKeys, cols);
            setColumnSelect(cols);
        },
        [dataSource, setColumnSelect],
    );

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex' }}>
                <h3 style={{ flexGrow: 1 }}>1. 设置显示内容</h3>
                {userid ? (
                    <Space>
                        <Button
                            onClick={() => onSave(columnSelect)}
                            type="primary"
                        >
                            存为我的设置
                        </Button>
                        <Button
                            danger
                            onClick={() => onSave([], setDefaultColumnSelect)}
                        >
                            恢复默认
                        </Button>
                    </Space>
                ) : null}
            </div>
            <Table
                dataSource={dataSource}
                pagination={false}
                columns={columnDefine}
                rowSelection={{ selectedRowKeys, onChange }}
            />
        </Space>
    );
}
