import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, Input } from 'antd';
import { useModel, useHistory } from 'umi';

import { users_insert, users_update, IUser } from '@/types/users';
import RootState from '@/models';
import { pess_unlock } from '@/types/pessimistic_lock';

interface IUserIncrRefresh extends IUser {
    setIncr: Dispatch<SetStateAction<number>>;
}

const UsersNewForm = React.forwardRef<Input, IUserIncrRefresh>(
    ({ setIncr, ...user }: IUserIncrRefresh, ref) => {
        console.log('user from caller', user);

        const dispatch = useDispatch();
        const history = useHistory();
        const { onClose, closable, setClosable } = useModel('useDrawer');
        const { queryModel, searchValues } = useModel('useUsers');
        const {
            users: {
                loginer: {
                    token,
                    user: { privilege, id },
                },
            },
            dicts,
        } = useSelector((states: RootState) => states);

        const onFinish = useCallback(
            (values) => {
                if (user.id > 0) {
                    users_update(
                        dispatch,
                        token,
                        {
                            ...values,
                            id: user.id,
                            version: user.version,
                        },
                        () => {
                            onClose();
                            if (closable.close) {
                                closable.close();
                                setClosable({});
                            }
                            setIncr((incr) => incr + 1);
                        },
                    );
                } else {
                    users_insert(dispatch, token, values, () => {
                        onClose();
                        setIncr((incr) => incr + 1);
                    });
                }
            },
            [user, searchValues, queryModel],
        );

        return (
            <Form
                layout="vertical"
                autoComplete="off"
                initialValues={{ ...user }}
                onFinish={onFinish}
                onValuesChange={(e) => console.log(e)}
                hideRequiredMark
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="email"
                            label="??????"
                            rules={[
                                {
                                    required: true,
                                    message: '???????????????',
                                    type: 'email',
                                },
                            ]}
                        >
                            <Input
                                placeholder="???????????????"
                                allowClear
                                type="email"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="??????"
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
                </Row>
                {!user.id ? (
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="password"
                                label="????????????"
                                rules={[
                                    {
                                        required: true,
                                        message: '??????????????????',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                ) : null}
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button
                        onClick={() => {
                            onClose();
                            if (user.id > 0) {
                                pess_unlock(dispatch, token, {
                                    table_name: 'users',
                                    id: user.id,
                                });
                            }
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

export default UsersNewForm;
