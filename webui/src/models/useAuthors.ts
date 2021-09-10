import { columnTableConfig } from '@/pages/Authors/columns';
import { useBaseModel } from '@/types/models';

export default function useAuthors() {
    return useBaseModel(columnTableConfig);
}
