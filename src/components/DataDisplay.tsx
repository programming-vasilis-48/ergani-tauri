import React, { useEffect, useRef } from 'react';
import { useAppState } from '../hooks/useAppState';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

export default function DataDisplay(): JSX.Element {
  const { data: { combined, summary } } = useAppState();
  const combinedTableRef = useRef<Tabulator>();
  const summaryTableRef = useRef<Tabulator>();
  const combinedContainerRef = useRef<HTMLDivElement>(null);
  const summaryContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (combined && combinedContainerRef.current) {
      if (combinedTableRef.current) {
        combinedTableRef.current.setData(combined);
      } else {
        combinedTableRef.current = new Tabulator(combinedContainerRef.current, {
          data: combined,
          layout: 'fitData',
          columns: generateColumns(combined),
        });
      }
    }
  }, [combined]);

  useEffect(() => {
    if (summary && summaryContainerRef.current) {
      if (summaryTableRef.current) {
        summaryTableRef.current.setData(summary);
      } else {
        summaryTableRef.current = new Tabulator(summaryContainerRef.current, {
          data: summary,
          layout: 'fitData',
          columns: generateColumns(summary),
        });
      }
    }
  }, [summary]);

  const generateColumns = (data: any[]): Tabulator.ColumnDefinition[] => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map(key => ({
      title: key,
      field: key,
      headerFilter: 'input',
    }));
  };

  if (!combined && !summary) {
    return <></>;
  }

  return (
    <div className="data-display">
      {combined && (
        <section id="combinedSection" className="mb-4">
          <h3>Combined Data</h3>
          <div ref={combinedContainerRef} className="table-container" />
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => combinedTableRef.current?.download('xlsx', 'combined_data.xlsx')}
          >
            Download Excel
          </button>
        </section>
      )}

      {summary && (
        <section id="summarySection" className="mb-4">
          <h3>Summary Data</h3>
          <div ref={summaryContainerRef} className="table-container" />
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => summaryTableRef.current?.download('xlsx', 'summary_data.xlsx')}
          >
            Download Excel
          </button>
        </section>
      )}
    </div>
  );
} 