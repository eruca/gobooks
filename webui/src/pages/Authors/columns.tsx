import dayjs from 'dayjs';

import { IDict } from '@/types/dicts';
import { IButtonArrayProps } from '@/components/Pages/hooks';
import { IAuthor } from '@/models/authors/authors';

export const columnsDef = (dicts: IDict[]) => [
    {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
    },
    {
        title: '中文名字',
        dataIndex: 'name_chinese',
        key: 'name_chinese',
    },
    {
        title: '拼音首字母',
        dataIndex: 'pinyin',
        key: 'pinyin',
    },
    {
        title: '英文名字',
        dataIndex: 'name_english',
        key: 'name_english',
    },
    {
        title: '国籍',
        dataIndex: 'nationality',
        key: 'nationality',
        render: (id: number) => dicts.find((dict) => dict.id === id)?.name,
    },
    {
        title: '作品数量',
        dataIndex: 'books_count',
        key: 'books_count',
    },
    {
        title: '说明',
        dataIndex: 'desc',
        key: 'desc',
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: dayjs.Dayjs) => (text ? text.fromNow() : null),
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text: dayjs.Dayjs) => (text ? text.fromNow() : null),
    },
];

export const columnTableConfig = columnsDef([]).map((col) => ({
    key: col.key,
    title: col.title,
    selected: true,
}));

export const buttonArrayProps: IButtonArrayProps<IAuthor> = {
    table_name: 'authors',
    onNewTitle: '增加作者',
    onNewComponent: 'AuthorsNewForm',
    onTableConfigComponent: 'AuthorsTableConfig',
    onSearchTitle: '搜索作者',
    onSearchComponent: 'AuthorsSearch',
    columnsDef,
};
