import { IDataSource } from '@/components/TableConfig';
import TableConfigPage from '@/components/TableConfig/TableConfigPage';

export default function DictsTableConfig({ dataSource }: IDataSource) {
    return <TableConfigPage dataSource={dataSource} model="useDicts" />;
}
