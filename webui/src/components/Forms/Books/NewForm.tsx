import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, Input, Select, InputNumber } from 'antd';
import { useModel } from 'umi';

import RootState from '@/models';
import { books_update, books_insert } from '@/types/books';
import fuzzysearch from '@/utils/fuzzysearch';
import generate_select_options from '@/utils/build_select_option';
import { IBook } from '@/types/books';

interface IBookIncrRefresh extends IBook {
    setIncr?: Dispatch<SetStateAction<number>>;
}

const BooksNewForm = React.forwardRef<Input, IBookIncrRefresh>(
    ({ setIncr, ...book }: IBookIncrRefresh, ref) => {
        console.log('author from caller', book);

        const dispatch = useDispatch();
        const { onClose, closable, setClosable } = useModel('useDrawer');
        const {
            dicts,
            users: {
                loginer: { token },
            },
        } = useSelector((states: RootState) => states);

        const onFinish = useCallback(
            (values) => {
                if (book.id > 0) {
                    books_update(
                        dispatch,
                        token,
                        {
                            ...values,
                            created_at: book.created_at,
                            id: book.id,
                            version: book.version,
                        },
                        () => {
                            onClose();
                            if (closable.close) {
                                closable.close();
                                setClosable({});
                            }
                            console.log('setIncr', setIncr, book);
                            setIncr && setIncr((n) => n + 1);
                        },
                    );
                } else {
                    books_insert(dispatch, token, values, () => {
                        onClose();
                        setIncr && setIncr((n) => n + 1);
                    });
                }
            },
            [book, token, onClose, dispatch, setIncr],
        );

        return (
            <Form
                layout="vertical"
                autoComplete="off"
                initialValues={book}
                onFinish={onFinish}
                hideRequiredMark
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name_chinese"
                            label="中文名字"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入中文名字',
                                },
                            ]}
                        >
                            <Input
                                ref={ref}
                                placeholder="请输入中文名字"
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="name_english" label="英文名字">
                            <Input placeholder="请输入英文名字" allowClear />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="isbn" label="ISBN">
                            <Input placeholder="请输入ISBN" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="pages" label="页数">
                            <InputNumber
                                step={1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="length" label="长度(cm)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="width" label="宽度(cm)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="height" label="高度(cm)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="weight" label="重量(g)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="publish_year" label="出版时间(年)">
                            <InputNumber min={1990} max={3000} step={1} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="price" label="价格(￥)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="book_series" label="书系列">
                            <Input allowClear placeholder="请输入书所属系列" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="tags" label="标签">
                            <Select
                                mode="multiple"
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="请选择标签，可以为空"
                            >
                                {generate_select_options(dicts.data, '标签')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="authors_id" label="作者(们)">
                            <Select
                                mode="multiple"
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="请选择标签，可以为空"
                            >
                                {generate_select_options(dicts.data, '作者')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="presses_id" label="出版社(s)">
                            <Select
                                mode="multiple"
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="请选择标签，可以为空"
                            >
                                {generate_select_options(dicts.data, '出版社')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="introduction" label="说明">
                            <Input.TextArea rows={4} placeholder="请输入说明" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="comment" label="备注">
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
                            // if (dict.id > 0) {
                            //     pess_unlock(dispatch, token, {
                            //         table_name: 'dicts',
                            //         id: dict.id,
                            //     });
                            // }
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
    },
);

export default BooksNewForm;
