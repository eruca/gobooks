import { useMemo } from 'react';
import { Form, Row, Col, Input, Select, Button } from 'antd';
import { useModel } from 'umi';
import { useSelector } from 'react-redux';

import RootState from '@/models';

export default function () {
    const { onClose } = useModel('useDrawer');
    const { setSearchValues, searchValues, queryModel } = useModel('useUsers');
    const {
        loginer: { token },
    } = useSelector((states: RootState) => states.users);

    const select_options = useMemo(
        () =>
            [[1, '医师']].map(([role, name]) => (
                <Select.Option key={role} value={role} children={name} />
            )),
        [],
    );

    return (
        <Form
            layout="vertical"
            autoComplete="off"
            initialValues={searchValues.values}
            onFinish={(values) => {
                setSearchValues({ onSearch: true, values });
                onClose();
            }}
            onValuesChange={(e) => console.log(e)}
            hideRequiredMark
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="name" label="姓名">
                        <Input placeholder="请输入名字" allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="email" label="邮箱">
                        <Input placeholder="请输入邮箱" allowClear />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="role" label="角色">
                        <Select
                            children={select_options}
                            placeholder="请输入角色"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                    取消
                </Button>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </div>
        </Form>
    );
}
