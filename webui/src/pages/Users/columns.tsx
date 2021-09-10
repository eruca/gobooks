import { IButtonArrayProps } from '@/components/Pages/hooks';
import { IDict } from '@/types/dicts';
import { IUser } from '@/types/users';
import dayjs from 'dayjs';

export const columnsDef = (dicts: IDict[]) => [
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

export const columnTableConfig = columnsDef([]).map((col) => ({
    key: col.key,
    title: col.title,
    selected: true,
}));

export const buttonArrayProps: IButtonArrayProps<IUser> = {
    table_name: 'users',
    onNewTitle: '增加用户',
    onNewComponent: 'UsersNewForm',
    onTableConfigComponent: 'UsersTableConfig',
    onSearchTitle: '搜索用户',
    onSearchComponent: 'UsersSearch',
    columnsDef,
};
