import { Button, Space, Popconfirm } from 'antd';

export interface IActionColumn {
    name: string;
    onModify: () => void;
    onDelete: () => void;
}

export default function ActionColumn({
    name,
    onModify,
    onDelete,
}: IActionColumn) {
    return (
        <Space size="middle">
            <Button type="primary" onClick={onModify}>
                修改
            </Button>
            <Popconfirm
                title={`是否确认删除'${name}'`}
                okText="确认"
                cancelText="取消"
                onConfirm={onDelete}
            >
                <Button danger>删除</Button>
            </Popconfirm>
        </Space>
    );
}
