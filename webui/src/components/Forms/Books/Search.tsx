import { useMemo } from 'react';
import { Form, Row, Col, Input, Select, Button, InputNumber } from 'antd';
import { useModel } from 'umi';
import { useSelector } from 'react-redux';

import RootState from '@/models';
import fuzzysearch from '@/utils/fuzzysearch';
import generate_select_options from '@/utils/build_select_option';

export default function () {
    const { onClose } = useModel('useDrawer');
    const { setSearchValues, searchValues } = useModel('useBooks');
    const dicts = useSelector((states: RootState) => states.dicts);

    return (
        <Form
            layout="vertical"
            autoComplete="off"
            initialValues={searchValues.values}
            onFinish={(values) => {
                console.log(values);
                onClose();
                setSearchValues({ onSearch: true, values });
            }}
            hideRequiredMark
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="name_chinese" label="中文名字">
                        <Input placeholder="请输入中文名字" allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="name_english" label="英文名字">
                        <Input placeholder="请输入英文名字" allowClear />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item name="isbn" label="ISBN">
                        <Input placeholder="请输入ISBN" allowClear />
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
                                fuzzysearch(input.toLowerCase(), option?.pinyin)
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
                    <Form.Item name="presses_id" label="出版社(s)">
                        <Select
                            mode="multiple"
                            filterOption={(input, option) =>
                                fuzzysearch(input.toLowerCase(), option?.pinyin)
                            }
                            allowClear
                            placeholder="请选择标签，可以为空"
                        >
                            {generate_select_options(dicts.data, '标签')}
                        </Select>
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
