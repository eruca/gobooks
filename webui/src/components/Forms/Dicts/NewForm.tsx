import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, Input, Select } from 'antd';
import { useModel } from 'umi';

import RootState from '@/models';
import { dicts_update, dicts_insert, IDict } from '@/types/dicts';
import fuzzysearch from '@/utils/fuzzysearch';
import { pess_unlock } from '@/types/pessimistic_lock';

const DictsNewForm = React.forwardRef<Input, IDict>((dict: IDict, ref) => {
    console.log('dict from caller', dict);

    const dispatch = useDispatch();
    const { onClose, closable, setClosable } = useModel('useDrawer');
    const {
        dicts: { data },
        users: {
            loginer: {
                token,
                user: { id },
            },
        },
    } = useSelector((states: RootState) => states);

    const [category, setCategory] = useState<string>(dict.category);

    // 所有categories的名字数组
    const categorys = useMemo(() => {
        const category_list = data
            .filter((dict) => dict.category === '类别')
            .map((dict) => dict.name);
        return id === 1 ? [...category_list, '类别'] : category_list;
    }, [id, data]);

    const father_options = useMemo(() => {
        if (!category) {
            return null;
        }
        return (
            dict
                ? data.filter(
                      (d) => d.category === category && d.id !== dict.id,
                  )
                : data.filter((d) => d.category === category)
        ).map((dict) => (
            <Select.Option key={dict.id} value={dict.id} pinyin={dict.pinyin}>
                {dict.name}
            </Select.Option>
        ));
    }, [category, dict, data]);

    const tags_options = useMemo(() => {
        return data
            .filter((d) => d.category !== '类别' && d.id !== dict.id)
            .map((d) => (
                <Select.Option key={d.id} value={d.id} pinyin={d.pinyin}>
                    {d.name}
                </Select.Option>
            ));
    }, [dict, data]);

    const onValuesChange = useCallback(
        (e) => {
            if (e && e.category) {
                setCategory(e.category);
            }
        },
        [setCategory],
    );

    const onFinish = useCallback(
        (values) => {
            if (dict.id > 0) {
                dicts_update(
                    dispatch,
                    token,
                    {
                        ...values,
                        created_at: dict.created_at,
                        id: dict.id,
                        version: dict.version,
                    },
                    () => {
                        onClose();
                        if (closable.close) {
                            closable.close();
                            setClosable({});
                        }
                    },
                );
            } else {
                dicts_insert(dispatch, token, values, () => {
                    onClose();
                });
            }
        },
        [dict, token, onClose, dispatch],
    );

    return (
        <Form
            layout="vertical"
            autoComplete="off"
            initialValues={{ ...dict }}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            hideRequiredMark
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入名称',
                            },
                        ]}
                    >
                        <Input ref={ref} placeholder="请输入名称" allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="category"
                        label="类别"
                        rules={[
                            {
                                required: true,
                                message: '请输入类别的名称',
                            },
                        ]}
                    >
                        <Select placeholder="请输入字典类别">
                            {categorys.map((name) => (
                                <Select.Option value={name} key={name}>
                                    {name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="father_id" label="父项">
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                fuzzysearch(input.toLowerCase(), option?.pinyin)
                            }
                            allowClear
                            placeholder="请选择父标签，可以为空"
                        >
                            {father_options}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="pinyin" label="拼音首字母">
                        <Input placeholder="请输入拼音首字母,不填可以自动生成" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item name="tags" label="标签">
                        <Select
                            mode="multiple"
                            filterOption={(input, option) =>
                                fuzzysearch(input.toLowerCase(), option?.pinyin)
                            }
                            allowClear
                            placeholder="请选择标签，可以为空"
                        >
                            {tags_options}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item name="desc" label="备注">
                        <Input.TextArea rows={4} placeholder="请输入备注" />
                    </Form.Item>
                </Col>
            </Row>
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button
                    onClick={() => {
                        onClose();
                        if (dict.id > 0) {
                            pess_unlock(dispatch, token, {
                                table_name: 'dicts',
                                id: dict.id,
                            });
                        }
                    }}
                    style={{ marginRight: 8 }}
                >
                    取消
                </Button>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </div>
        </Form>
    );
});

export default DictsNewForm;
