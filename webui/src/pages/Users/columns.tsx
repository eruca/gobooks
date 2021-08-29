import dayjs from 'dayjs';

export const columnsDef = [
    {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        render: (role: number) => role,
    },
    {
        title: '权限',
        dataIndex: 'privilege',
        key: 'privilege',
        render: (privilege: number) => privilege,
    },
    {
        title: '更新',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (updated_at: string) => dayjs(updated_at).fromNow(),
    },
];
