import { useMemo } from 'react';
import { Form, Row, Col, Input, Select, Button } from 'antd';
import { useModel } from 'umi';
import { useSelector } from 'react-redux';

import RootState from '@/models';
import { IDict } from '@/types/dicts';
import fuzzysearch from '@/utils/fuzzysearch';

export default function () {
    const { onClose } = useModel('useDrawer');
    const { setSearchValues, searchValues } = useModel('useDicts');
    const dicts = useSelector((states: RootState) => states.dicts);

    const options = useMemo(() => {
        const fathers = dicts.data
            .filter((dict) => dict.father_id > 0)
            .map((dict) => dict.father_id);
        return dicts.data
            .filter((dict) => fathers.includes(dict.id))
            .map((dict: IDict) => (
                <Select.Option
                    key={dict.id}
                    value={dict.id}
                    pinyin={dict.pinyin}
                >
                    {dict.name}
                </Select.Option>
            ));
    }, [dicts]);

    const tags_options = useMemo(() => {
        return dicts.data
            .filter((d) => d.category === '标签')
            .map((d) => (
                <Select.Option key={d.id} value={d.id} pinyin={d.pinyin}>
                    {d.name}
                </Select.Option>
            ));
    }, [dicts]);

    const categorys = useMemo(
        () =>
            dicts.data
                .filter((dict) => dict.category === '类别')
                .map((dict) => dict.name),
        [dicts],
    );

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
            onValuesChange={(e) => console.log(e)}
            hideRequiredMark
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="name" label="名称">
                        <Input placeholder="请输入名称" allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="category" label="类别">
                        <Select>
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
                    <Form.Item name="father_id" label="父标签">
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                fuzzysearch(input.toLowerCase(), option?.pinyin)
                            }
                        >
                            {options}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="pinyin" label="拼音首字母">
                        <Input placeholder="请输入拼音首字母" allowClear />
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
