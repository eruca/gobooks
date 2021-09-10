import { useBaseModel } from '@/types/models';
import { columnTableConfig } from '@/pages/Books/columns';

export default function useAuthors() {
    return useBaseModel(columnTableConfig);
}
