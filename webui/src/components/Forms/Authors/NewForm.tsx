import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, Input, Select } from 'antd';
import { useModel } from 'umi';

import { IAuthor } from '@/models/authors/authors';
import RootState from '@/models';
import { authors_update, authors_insert } from '@/types/authors';
import fuzzysearch from '@/utils/fuzzysearch';
import generate_select_options from '@/utils/build_select_option';

interface IAuthorIncrRefresh extends IAuthor {
    setIncr?: Dispatch<SetStateAction<number>>;
}

const AuthorsNewForm = React.forwardRef<Input, IAuthorIncrRefresh>(
    ({ setIncr, ...author }: IAuthorIncrRefresh, ref) => {
        console.log('author from caller', author);

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
                if (author.id > 0) {
                    authors_update(
                        dispatch,
                        token,
                        {
                            ...values,
                            created_at: author.created_at,
                            id: author.id,
                            version: author.version,
                        },
                        () => {
                            onClose();
                            if (closable.close) {
                                closable.close();
                                setClosable({});
                            }
                            setIncr && setIncr((n) => n + 1);
                        },
                    );
                } else {
                    authors_insert(dispatch, token, values, () => {
                        onClose();
                        setIncr && setIncr((n) => n + 1);
                    });
                }
            },
            [author, token, onClose, dispatch],
        );

        return (
            <Form
                layout="vertical"
                autoComplete="off"
                initialValues={author}
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
                        <Form.Item name="pinyin" label="??????">
                            <Input
                                placeholder="???????????????????????????????????????????????????"
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="name_english" label="????????????">
                            <Input placeholder="?????????????????????" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="nationality" label="??????">
                            <Select
                                showSearch
                                filterOption={(input, option) =>
                                    fuzzysearch(
                                        input.toLowerCase(),
                                        option?.pinyin,
                                    )
                                }
                                allowClear
                                placeholder="?????????????????????????????????"
                            >
                                {generate_select_options(dicts.data, '??????')}
                            </Select>
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
                        <Form.Item name="desc" label="??????">
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

export default AuthorsNewForm;
