import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import TableConfig, { IDataSource } from '@/components/TableConfig';
import { users_update } from '@/types/users';
import RootState from '@/models';
import { ITableConfigDataType } from '@/types/table_config';
import { UseModels } from '@/types/models';

interface IProps extends IDataSource {
    model: UseModels;
}

export default function ({ dataSource, model }: IProps) {
    const dispatch = useDispatch();
    const { token, user } = useSelector(
        (states: RootState) => states.users.loginer,
    );

    const onSave = useCallback(
        (
            columnSelect: ITableConfigDataType[],
            setDefaultColumnSelect?: () => void,
        ) => {
            const { settings, ...user_parts } = user;
            users_update(
                dispatch,
                token,
                {
                    ...user_parts,
                    settings: { ...settings, user_config: columnSelect },
                },
                () => setDefaultColumnSelect && setDefaultColumnSelect(),
            );
        },
        [user],
    );

    return (
        <TableConfig
            onSave={onSave}
            dataSource={dataSource}
            userid={user.id}
            model={model}
        />
    );
}
