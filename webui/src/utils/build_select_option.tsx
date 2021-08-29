import { useMemo } from 'react';
import { IDict } from '@/models/dicts/dicts';
import { Select } from 'antd';

export default function generate_select_options(dicts: IDict[], cate: string) {
    return useMemo(
        () =>
            dicts
                .filter((dict: IDict) => dict.category === cate)
                .map((dict) => (
                    <Select.Option
                        key={dict.id}
                        value={dict.id}
                        pinyin={dict.pinyin}
                    >
                        {dict.name}
                    </Select.Option>
                )),
        [dicts, cate],
    );
}
