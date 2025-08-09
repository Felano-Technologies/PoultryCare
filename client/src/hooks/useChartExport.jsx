import { useState } from 'react';
import html2canvas from 'html2canvas';

export const useChartExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportChart = async (chartContainer, chartName) => {
    if (!chartContainer || isExporting) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc, element) => {
          // Force dimensions for Chart.js canvas
          const canvasElement = element.querySelector('canvas');
          if (canvasElement) {
            canvasElement.style.width = '100%';
            canvasElement.style.height = '100%';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `${chartName}-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportChart, isExporting };
};