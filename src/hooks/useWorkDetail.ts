import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkById, getRelatedWorks } from '@/services/DataService';
import type { ClassicalWork } from '@/types';

export function useWorkDetail() {
  const { id } = useParams<{ id: string }>();

  const work: ClassicalWork | undefined = useMemo(() => {
    if (!id) return undefined;
    return getWorkById(id);
  }, [id]);

  const relatedWorks = useMemo(() => {
    if (!id) return [];
    return getRelatedWorks(id, 6);
  }, [id]);

  return { work, relatedWorks, id };
}
