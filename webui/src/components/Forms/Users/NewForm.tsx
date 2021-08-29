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
                            label="邮箱"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入邮箱',
                                    type: 'email',
                                },
                            ]}
                        >
                            <Input
                                placeholder="请输入邮箱"
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
                            label="姓名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的名字',
                                },
                            ]}
                        >
                            <Input
                                ref={ref}
                                placeholder="请输入您的名字"
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
                                label="默认密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '输入默认密码',
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

export default UsersNewForm;
