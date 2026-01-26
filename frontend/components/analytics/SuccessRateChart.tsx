import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface DataPoint {
  date: string;
  timestamp: number;
  overallRate: number;
  proposalCount: number;
  categories: Record<string, number>;
}

interface SuccessRateChartProps {
  data?: DataPoint[];
}

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({ data = [] }) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>('30d');
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  // Calculate moving averages
  const calculateMovingAverage = (data: DataPoint[], window: number, key: 'overallRate') => {
    return data.map((point, idx) => {
      const start = Math.max(0, idx - window + 1);
      const slice = data.slice(start, idx + 1);
      const avg = slice.reduce((sum, p) => sum + p[key], 0) / slice.length;
      return avg;
    });
  };

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges: Record<DateRange, number> = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      'all': Infinity,
    };

    const cutoff = now - ranges[selectedRange];
    return data.filter(d => d.timestamp >= cutoff);
  }, [data, selectedRange]);

  // Process data with moving averages and top categories
  const processedData = useMemo(() => {
    if (!filteredData.length) return [];

    // Calculate moving averages
    const ma7 = calculateMovingAverage(filteredData, 7, 'overallRate');
    const ma30 = calculateMovingAverage(filteredData, 30, 'overallRate');

    // Find top 5 categories by frequency
    const categoryFrequency: Record<string, number> = {};
    filteredData.forEach(point => {
      Object.keys(point.categories || {}).forEach(cat => {
        categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
      });
    });
    
    const topCategories = Object.entries(categoryFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat]) => cat);

    return filteredData.map((point, idx) => ({
      ...point,
      ma7: ma7[idx],
      ma30: ma30[idx],
      ...topCategories.reduce((acc, cat) => ({
        ...acc,
        [cat]: point.categories[cat] || null,
      }), {}),
      topCategories,
    }));
  }, [filteredData]);

  // Get unique categories for legend
  const categories = useMemo(() => {
    if (!processedData.length) return [];
    return processedData[0]?.topCategories || [];
  }, [processedData]);

  // Calculate trend indicator
  const getTrend = (current: number, previous: number) => {
    if (Math.abs(current - previous) < 0.5) return '→';
    return current > previous ? '↑' : '↓';
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const prevData = processedData[processedData.indexOf(data) - 1];
    const trend = prevData ? getTrend(data.overallRate, prevData.overallRate) : '→';

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="font-semibold text-gray-800 mb-2">{data.date}</p>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Success Rate:</span>
            <span className={`font-semibold flex items-center gap-1 ${
              data.overallRate >= 70 ? 'text-green-600' : 
              data.overallRate >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data.overallRate.toFixed(1)}% {trend}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Proposals:</span>
            <span className="font-semibold text-gray-800">{data.proposalCount}</span>
          </div>

          {payload.filter((p: any) => p.dataKey !== 'overallRate' && !p.dataKey.startsWith('ma')).map((p: any) => {
            if (hiddenSeries.has(p.dataKey) || p.value === null) return null;
            return (
              <div key={p.dataKey} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{p.dataKey}:</span>
                <span className="font-semibold" style={{ color: p.color }}>
                  {p.value.toFixed(1)}%
                </span>
              </div>
            );
          })}

          {!hiddenSeries.has('ma7') && data.ma7 && (
            <div className="flex items-center justify-between pt-1 border-t border-gray-200 mt-1">
              <span className="text-xs text-gray-500">7-day avg:</span>
              <span className="text-xs font-medium text-gray-700">{data.ma7.toFixed(1)}%</span>
            </div>
          )}

          {!hiddenSeries.has('ma30') && data.ma30 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">30-day avg:</span>
              <span className="text-xs font-medium text-gray-700">{data.ma30.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle legend click
  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  // Custom legend
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any) => (
          <button
            key={entry.dataKey}
            onClick={() => handleLegendClick(entry.dataKey)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              hiddenSeries.has(entry.dataKey)
                ? 'opacity-40 hover:opacity-60'
                : 'hover:bg-gray-100'
            }`}
          >
            <div
              className="w-4 h-0.5 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.value}</span>
          </button>
        ))}
      </div>
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Success Rate', 'Proposals', ...categories, '7-day MA', '30-day MA'];
    const csvContent = [
      headers.join(','),
      ...processedData.map(d => [
        d.date,
        d.overallRate.toFixed(2),
        d.proposalCount,
        ...categories.map(cat => (d as any)[cat]?.toFixed(2) || ''),
        d.ma7.toFixed(2),
        d.ma30.toFixed(2),
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `success-rate-${selectedRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to PNG
  const exportToPNG = () => {
    const svgElement = document.querySelector('.recharts-wrapper svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `success-rate-chart-${selectedRange}.png`;
      a.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const categoryColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Success Rate Trends</h2>
          <p className="text-sm text-gray-500 mt-1">Historical success rate analysis by category</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y', 'all'] as DateRange[]).map(range => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedRange === range
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Export as CSV"
            >
              CSV
            </button>
            <button
              onClick={exportToPNG}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Export as PNG"
            >
              PNG
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {processedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />

            {/* Overall success rate with gradient */}
            {!hiddenSeries.has('overallRate') && (
              <Area
                type="monotone"
                dataKey="overallRate"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorOverall)"
                name="Overall Success Rate"
                dot={{ fill: '#10b981', r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {/* Category lines */}
            {categories.map((cat, idx) => (
              !hiddenSeries.has(cat) && (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stroke={categoryColors[idx % categoryColors.length]}
                  strokeWidth={2}
                  name={cat}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              )
            ))}

            {/* Moving averages */}
            {!hiddenSeries.has('ma7') && (
              <Line
                type="monotone"
                dataKey="ma7"
                stroke="#9ca3af"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="7-day MA"
                dot={false}
              />
            )}

            {!hiddenSeries.has('ma30') && (
              <Line
                type="monotone"
                dataKey="ma30"
                stroke="#6b7280"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="30-day MA"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No data available</p>
            <p className="text-sm text-gray-500 mt-1">Success rate data will appear here</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {processedData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Avg Success</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {(processedData.reduce((sum, d) => sum + d.overallRate, 0) / processedData.length).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Proposals</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {processedData.reduce((sum, d) => sum + d.proposalCount, 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Best Day</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {Math.max(...processedData.map(d => d.overallRate)).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Categories</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{categories.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessRateChart;
