import dayjs from 'dayjs';
import { Tag } from 'antd';

import { IDict } from '@/models/dicts/dicts';
import { colors } from '@/constants/colors';

export const columnsDef = (data: IDict[]) => [
    {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: '拼音首字母',
        dataIndex: 'pinyin',
        key: 'pinyin',
    },
    {
        title: '父标签',
        dataIndex: 'father_id',
        key: 'father_id',
        render: (father_id: number) =>
            data.find((tag) => tag.id === father_id)?.name,
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
                              {data.find((tag) => tag.id === tagid)?.name}
                          </Tag>
                      ))
                    : null}
            </>
        ),
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
