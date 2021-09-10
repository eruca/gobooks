import { useBaseModel } from '@/types/models';
import { columnTableConfig } from '@/pages/Dicts/columns';

export default function useDicts() {
    return useBaseModel(columnTableConfig);
}
