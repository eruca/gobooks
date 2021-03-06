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
                            label="????????????"
                            rules={[
                                {
                                    required: true,
                                    message: '?????????????????????',
                                },
                            ]}
                        >
                            <Input
                                ref={ref}
                                placeholder="?????????????????????"
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="name_english" label="????????????">
                            <Input placeholder="?????????????????????" allowClear />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="isbn" label="ISBN">
                            <Input placeholder="?????????ISBN" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="pages" label="??????">
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
                        <Form.Item name="length" label="??????(cm)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="width" label="??????(cm)">
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
                        <Form.Item name="height" label="??????(cm)">
                            <InputNumber
                                step={0.1}
                                max={3000}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="weight" label="??????(g)">
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
                        <Form.Item name="publish_year" label="????????????(???)">
                            <InputNumber min={1990} max={3000} step={1} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="price" label="??????(???)">
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
                        <Form.Item name="book_series" label="?????????">
                            <Input allowClear placeholder="????????????????????????" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="tags" label="??????">
                            <Select
                                mode="multiple"
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="??????????????????????????????"
                            >
                                {generate_select_options(dicts.data, '??????')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="authors_id" label="??????(???)">
                            <Select
                                mode="multiple"
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="??????????????????????????????"
                            >
                                {generate_select_options(dicts.data, '??????')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="presses_id" label="?????????(s)">
                            <Select
                                mode="multiple"
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="??????????????????????????????"
                            >
                                {generate_select_options(dicts.data, '?????????')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="introduction" label="??????">
                            <Input.TextArea rows={4} placeholder="???????????????" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="comment" label="??????">
                            <Input.TextArea rows={4} placeholder="???????????????" />
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
                        ??????
                    </Button>
                    <Button type="primary" htmlType="submit">
                        ??????
                    </Button>
                </div>
            </Form>
        );
    },
);

export default BooksNewForm;
