import { BusinessIdea } from '@/types/idea';
import { format } from 'date-fns';

interface ColumnDefinition {
  key: string;
  label: string;
}

export const CSV_COLUMNS = {
  ideas: [
    { key: 'name', label: 'Idea Name' },
    { key: 'description', label: 'Description' },
    { key: 'industry', label: 'Industry' },
    { key: 'province', label: 'Province' },
    { key: 'viability_score', label: 'Viability Score' },
    { key: 'market_fit_score', label: 'Market Fit' },
    { key: 'skills_match_score', label: 'Skills Match' },
    { key: 'recession_resistance_score', label: 'Recession Resistance' },
    { key: 'pain_point_severity', label: 'Pain Point (1-10)' },
    { key: 'ai_leverage_score', label: 'AI Leverage' },
    { key: 'startup_cost_min', label: 'Min Startup Cost' },
    { key: 'startup_cost_max', label: 'Max Startup Cost' },
    { key: 'monthly_revenue_min', label: 'Min Monthly Revenue' },
    { key: 'monthly_revenue_max', label: 'Max Monthly Revenue' },
    { key: 'side_hustle_compatible', label: 'Side Hustle OK' },
    { key: 'newcomer_friendly', label: 'Newcomer Friendly' },
    { key: 'competitors', label: 'Competitors' },
    { key: 'grants', label: 'Relevant Grants' },
    { key: 'created_at', label: 'Date Saved' },
  ] as ColumnDefinition[],
  grants: [
    { key: 'name', label: 'Grant Name' },
    { key: 'description', label: 'Description' },
    { key: 'province', label: 'Province' },
    { key: 'grant_type', label: 'Type' },
    { key: 'funding_min', label: 'Min Funding' },
    { key: 'funding_max', label: 'Max Funding' },
    { key: 'deadline', label: 'Deadline' },
    { key: 'newcomer_eligible', label: 'Newcomer Eligible' },
    { key: 'side_hustle_eligible', label: 'Side Hustle Eligible' },
    { key: 'match_score', label: 'Match Score' },
    { key: 'url', label: 'Application URL' },
  ] as ColumnDefinition[],
};

const escapeCSV = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return `"${value.join(', ')}"`;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const generateCSV = <T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnDefinition[]
): string => {
  const headers = columns.map(c => c.label).join(',');
  const rows = data.map(item =>
    columns.map(c => escapeCSV(item[c.key])).join(',')
  );
  return [headers, ...rows].join('\n');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const useExports = () => {
  const exportIdeasCSV = (ideas: BusinessIdea[], selectedColumns?: string[]) => {
    const columns = selectedColumns
      ? CSV_COLUMNS.ideas.filter(c => selectedColumns.includes(c.key))
      : CSV_COLUMNS.ideas;

    // Transform ideas to flatten nested data
    const flattenedIdeas = ideas.map(idea => ({
      ...idea,
      competitors: idea.competitors?.join(', ') || '',
      grants: idea.grants?.join(', ') || '',
    }));

    const csv = generateCSV(flattenedIdeas, columns);
    const filename = `spark-ideas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadFile(csv, filename, 'text/csv');

    return { success: true, count: ideas.length, filename };
  };

  const exportIdeasJSON = (ideas: BusinessIdea[], selectedColumns?: string[]) => {
    let data: Record<string, unknown>[];

    if (selectedColumns) {
      data = ideas.map(idea => {
        const filtered: Record<string, unknown> = {};
        selectedColumns.forEach(key => {
          filtered[key] = (idea as Record<string, unknown>)[key];
        });
        return filtered;
      });
    } else {
      data = ideas;
    }

    const json = JSON.stringify(data, null, 2);
    const filename = `spark-ideas-${format(new Date(), 'yyyy-MM-dd')}.json`;
    downloadFile(json, filename, 'application/json');

    return { success: true, count: ideas.length, filename };
  };

  const exportGrantsCSV = (grants: Array<{
    grant: Record<string, unknown>;
    matchPercentage?: number;
  }>) => {
    const flattenedGrants = grants.map(g => ({
      ...g.grant,
      match_score: g.matchPercentage || 0,
    }));

    const csv = generateCSV(flattenedGrants, CSV_COLUMNS.grants);
    const filename = `spark-grants-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadFile(csv, filename, 'text/csv');

    return { success: true, count: grants.length, filename };
  };

  const exportGrantsJSON = (grants: Array<{
    grant: Record<string, unknown>;
    matchPercentage?: number;
  }>) => {
    const data = grants.map(g => ({
      ...g.grant,
      match_score: g.matchPercentage || 0,
    }));

    const json = JSON.stringify(data, null, 2);
    const filename = `spark-grants-${format(new Date(), 'yyyy-MM-dd')}.json`;
    downloadFile(json, filename, 'application/json');

    return { success: true, count: grants.length, filename };
  };

  return {
    exportIdeasCSV,
    exportIdeasJSON,
    exportGrantsCSV,
    exportGrantsJSON,
    CSV_COLUMNS,
  };
};
