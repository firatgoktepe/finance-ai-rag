import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Chart component to handle different chart types
const FinanceChart = ({ type, data }) => {
  try {
    const chartData = {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: [
          'rgba(65, 27, 141, 0.8)',   // Primary purple
          'rgba(116, 72, 205, 0.8)',  // Light purple
          'rgba(40, 16, 88, 0.8)',    // Dark purple
          'rgba(156, 124, 219, 0.8)', // Lighter purple
          'rgba(90, 57, 161, 0.8)',   // Medium purple
        ],
        borderColor: 'rgba(65, 27, 141, 1)',
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        title: {
          display: !!data.title,
          text: data.title || '',
        },
      },
    };

    switch (type.toLowerCase()) {
      case 'line':
        return <Line data={chartData} options={options} className="finance-chart" />;
      case 'bar':
        return <Bar data={chartData} options={options} className="finance-chart" />;
      case 'pie':
        return <Pie data={chartData} options={options} className="finance-chart" />;
      default:
        return <div>Unsupported chart type</div>;
    }
  } catch (error) {
    console.error('Error rendering chart:', error);
    return <div>Error rendering chart</div>;
  }
};

const markdownComponents = {
  p: ({ children }: any) => <p className="bub">{children}</p>,
  strong: ({ children }: any) => <strong className="bub">{children}</strong>,
  ul: ({ children }: any) => <ul className="bub">{children}</ul>,
  li: ({ children }: any) => (
    <li className="bub">
      (<span className="bub">✅</span>
      <span>{children}</span>)
    </li>
  ),
  a: ({ children }: any) => <a className="bub">{children}</a>,
  h1: ({ children }: any) => <h1>{children}</h1>,
  h2: ({ children }: any) => <h2>{children}</h2>,
  h3: ({ children }: any) => <h3>{children}</h3>,
  table: ({ children }: any) => <table className="finance-table">{children}</table>,
  thead: ({ children }: any) => <thead>{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr>{children}</tr>,
  th: ({ children }: any) => <th className="finance-table-header">{children}</th>,
  td: ({ children }: any) => <td className="finance-table-cell">{children}</td>,
};

const Bubble = ({ message }) => {
  const { content, role } = message;
  const [charts, setCharts] = useState([]);
  const [textContent, setTextContent] = useState(content);

  useEffect(() => {
    // Process chart tags in the content
    const processChartTags = (text) => {
      const chartRegex = /<chart[^>]*type="([^"]*)"[^>]*data=({[^>]*})[^>]*>/g;
      const newCharts = [];
      const processedText = text.replace(chartRegex, (match, type, data) => {
        try {
          const chartData = JSON.parse(data);
          const chartKey = Math.random().toString(36).substring(7);
          newCharts.push({ key: chartKey, type, data: chartData });
          return `[CHART_${chartKey}]`; // Placeholder for chart location
        } catch (error) {
          console.error('Error processing chart:', error);
          return '[Error processing chart]';
        }
      });

      setCharts(newCharts);
      return processedText;
    };

    setTextContent(processChartTags(content));
  }, [content]);

  // Split content by chart placeholders and render accordingly
  const renderContent = () => {
    const parts = textContent.split(/(\[CHART_[^\]]+\])/);
    return parts.map((part, index) => {
      const chartMatch = part.match(/\[CHART_([^\]]+)\]/);
      if (chartMatch) {
        const chartKey = chartMatch[1];
        const chart = charts.find(c => c.key === chartKey);
        if (chart) {
          return (
            <div key={chart.key} className="chart-container">
              <FinanceChart type={chart.type} data={chart.data} />
            </div>
          );
        }
      }
      return (
        <ReactMarkdown 
          key={index}
          components={markdownComponents}
          rehypePlugins={[rehypeRaw]}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className={`${role} bub`}>
      {renderContent()}
    </div>
  );
};

export default Bubble;
