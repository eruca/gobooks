import { useBaseModel } from '@/types/models';
import { columnTableConfig } from '@/pages/Users/columns';

export default function useUsers() {
    return useBaseModel(columnTableConfig);
}
