import { useMemo, useState, useCallback } from 'react';
import { getAllWorks } from '@/services/DataService';
import type { DailyPoem } from '@/types';

/** Get a "daily poem" — deterministic by default, can be manually refreshed */
export function useDailyPoem() {
  const [refreshKey, setRefreshKey] = useState(0);

  const daily = useMemo(() => {
    const works = getAllWorks();
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const baseIndex = dayOfYear + refreshKey;
    const index = ((baseIndex % works.length) + works.length) % works.length;
    const work = works[index];

    const reasons = [
      `今日推荐《${work.title}》，${work.dynasty}${work.author}的经典之作。`,
      `每日一诗：品读${work.author}的《${work.title}》，感受古典文学之美。`,
      `今日赏析：《${work.title}》——${work.dynasty}名篇，${work.author}作。`,
    ];
    const reasonIndex = baseIndex % reasons.length;

    return { work, reason: reasons[reasonIndex] };
  }, [refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { ...daily, refresh };
}
