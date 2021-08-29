import { useCallback, useMemo } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory, useModel } from 'umi';

import { users_login } from '@/types/users';
import { formItemLayout, buttonItemLayout } from '@/utils/item_layout';

export default function () {
    const history = useHistory();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { setColumnSelect, setDefaultColumnSelect } = useModel('useUsers');
    const { setColumnSelect: scs, setDefaultColumnSelect: sdcs } =
        useModel('useDicts');
    const { setColumnSelect: author_scs, setDefaultColumnSelect: author_sdcs } =
        useModel('useAuthors');

    const map = useMemo(
        () => ({
            user_config: [setDefaultColumnSelect, setColumnSelect],
            dict_config: [sdcs, scs],
            author_config: [author_sdcs, author_scs],
        }),
        [],
    );

    const onFinish = useCallback(
        (values) => {
            console.log(values);
            // 登录成功后调至 "/"，同时设置user_tabler_config
            users_login(dispatch, values, (action) => {
                console.log('user_login success', action);
                history.push('/');

                for (const [k, v] of Object.entries(
                    action.payload.user.settings,
                )) {
                    // switch (k) {
                    //     case 'user_config':
                    //     case 'dict_config':
                    //     case 'author_config':
                    // }

                    // @ts-ignore
                    const [sdcs, scs] = map[k];
                    if (!v || (Array.isArray(v) && v.length === 0)) {
                        sdcs();
                    } else {
                        scs(v as any);
                    }
                }
            });
        },
        [dispatch],
    );

    return (
        <Card title="登录" style={{ width: '30rem', marginTop: '-2rem' }}>
            <Form
                {...formItemLayout}
                layout="horizontal"
                form={form}
                autoComplete="off"
                initialValues={{}}
                onValuesChange={(e) => console.log(e)}
                onFinish={onFinish}
            >
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: '请输入账号',
                        },
                    ]}
                >
                    <Input placeholder="请输入您的账号" allowClear />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                    ]}
                >
                    <Input
                        placeholder="请输入您的密码"
                        type="password"
                        allowClear
                    />
                </Form.Item>
                <Form.Item {...buttonItemLayout}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <Button
                        style={{ marginLeft: '5px' }}
                        onClick={() => history.push('/register')}
                    >
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
