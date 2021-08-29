import { useState } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'umi';

import { users_insert } from '@/types/users';
import { formItemLayout, buttonItemLayout } from '@/utils/item_layout';
import RootState from '@/models';

export default function () {
    const dispatch = useDispatch();
    const {
        loginer: { token },
    } = useSelector((states: RootState) => states.users);
    const hisotry = useHistory();

    const [form] = Form.useForm();
    const [validate, setValidate] = useState<'success' | 'error'>('success');

    console.log('validate', validate);
    return (
        <Card title="注册" style={{ width: '35rem', marginTop: '-5rem' }}>
            <Form
                {...formItemLayout}
                layout="horizontal"
                autoComplete="off"
                form={form}
                initialValues={{}}
                onValuesChange={(changedValue, allValues) => {
                    if (changedValue['password2']) {
                        changedValue['password2'] == allValues['password']
                            ? setValidate('success')
                            : setValidate('error');
                    }
                }}
                onFinish={(e) => {
                    console.log(e);
                    const { password2, ...user } = e;
                    users_insert(dispatch, token, user, () =>
                        hisotry.push('/login'),
                    );
                }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: '输入Email',
                            type: 'email',
                        },
                    ]}
                >
                    <Input
                        placeholder="请输入Email"
                        inputMode="email"
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: '输入您的名字' }]}
                >
                    <Input placeholder="请输入您的名字" allowClear />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        { required: true, message: '请输入您的密码' },
                        { min: 3, message: '密码不能小于3位' },
                    ]}
                >
                    <Input
                        placeholder="请输入您的密码"
                        type="password"
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    label="密码2"
                    name="password2"
                    rules={[
                        { required: true, message: '必须再次填写一次密码' },
                    ]}
                    validateStatus={validate}
                >
                    <Input
                        placeholder="请再次输入您的密码"
                        type="password"
                        allowClear
                    />
                </Form.Item>
                <Form.Item {...buttonItemLayout}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={validate === 'error'}
                    >
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
