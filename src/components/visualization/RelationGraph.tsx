import { useMemo } from 'react';
import EChartsBase from './EChartsBase';
import { buildRelationGraph, buildGraphOption } from '@/services/GraphService';
import { useThemeStore } from '@/stores/useThemeStore';

interface RelationGraphProps {
  workId?: string;
  height?: string;
}

export default function RelationGraph({ workId, height = '450px' }: RelationGraphProps) {
  const { effectiveTheme } = useThemeStore();

  const { nodes, edges } = useMemo(() => {
    return buildRelationGraph(workId);
  }, [workId]);

  const option = useMemo(() => {
    if (nodes.length === 0) return null;
    return buildGraphOption(nodes, edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, effectiveTheme]);

  // Empty data state
  if (nodes.length === 0 || !option) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        <span>暂无关系数据</span>
      </div>
    );
  }

  return <EChartsBase option={option} height={height} />;
}
