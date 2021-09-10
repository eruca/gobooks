import dayjs from 'dayjs';
import { Tag } from 'antd';

import { IDict } from '@/types/dicts';
import { IButtonArrayProps } from '@/components/Pages/hooks';
import { IBook } from '@/types/books';
import { colors } from '@/constants/colors';

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
        title: '英文名字',
        dataIndex: 'name_english',
        key: 'name_english',
    },
    {
        title: 'isbn',
        dataIndex: 'isbn',
        key: 'isbn',
    },
    {
        title: '出版时间(年)',
        dataIndex: 'publish_year',
        key: 'publish_year',
    },
    {
        title: '作者(们)',
        dataIndex: 'authors_id',
        key: 'authors_id',
        render: (tags: number[]) => (
            <>
                {Array.isArray(tags) && tags.length > 0
                    ? tags.map((tagid, i) => (
                          <Tag key={tagid} color={colors[i % 12]}>
                              {dicts.find((tag) => tag.id === tagid)?.name}
                          </Tag>
                      ))
                    : null}
            </>
        ),
    },
    {
        title: '出版社(s)',
        dataIndex: 'presses_id',
        key: 'presses_id',
        render: (tags: number[]) => (
            <>
                {Array.isArray(tags) && tags.length > 0
                    ? tags.map((tagid, i) => (
                          <Tag key={tagid} color={colors[i % 12]}>
                              {dicts.find((tag) => tag.id === tagid)?.name}
                          </Tag>
                      ))
                    : null}
            </>
        ),
    },
    {
        title: '价格(￥)',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '页数',
        dataIndex: 'pages',
        key: 'pages',
    },
    {
        title: '长度(cm)',
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: '宽度(cm)',
        dataIndex: 'width',
        key: 'width',
    },
    {
        title: '高度(cm)',
        dataIndex: 'height',
        key: 'height',
    },
    {
        title: '重量(g)',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: '书系列',
        dataIndex: 'book_series',
        key: 'book_series',
    },
    {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        render: (tags: number[]) => (
            <>
                {Array.isArray(tags) && tags.length > 0
                    ? tags.map((tagid, i) => (
                          <Tag key={tagid} color={colors[i % 12]}>
                              {dicts.find((tag) => tag.id === tagid)?.name}
                          </Tag>
                      ))
                    : null}
            </>
        ),
    },
    {
        title: '说明',
        dataIndex: 'introduction',
        key: 'introduction',
    },
    {
        title: '备注',
        dataIndex: 'comment',
        key: 'comment',
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

export const buttonArrayProps: IButtonArrayProps<IBook> = {
    table_name: 'books',
    onNewTitle: '增加书本',
    onNewComponent: 'BooksNewForm',
    onTableConfigComponent: 'BooksTableConfig',
    onSearchTitle: '搜索书本',
    onSearchComponent: 'BooksSearch',
    columnsDef,
};
