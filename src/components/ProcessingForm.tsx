import React, { FormEvent, useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { handleAsyncOperation } from '../utils/errorHandling';
import { DateRange, calculateDateRange, validateDateRange } from '../utils/dateUtils';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';

interface ProcessingResult {
  combined_excel: string;
  summary_excel: string;
  combined_json: string;
  summary_json: string;
}

export default function ProcessingForm(): JSX.Element {
  const { data: { user }, setState } = useAppState();
  const [selectedRange, setSelectedRange] = useState<DateRange>('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [removeFuture, setRemoveFuture] = useState(false);
  const [removeDayOff, setRemoveDayOff] = useState(false);

  if (!user) {
    return <></>;
  }

  const handleChooseDir = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });
      if (selected && typeof selected === 'string') {
        setOutputDir(selected);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await handleAsyncOperation(async () => {
      const { start_date, end_date } = calculateDateRange(
        selectedRange,
        customStartDate,
        customEndDate
      );

      validateDateRange(start_date, end_date);

      if (!outputDir) {
        throw new Error('Please select an output directory');
      }

      const params = {
        usernameInfo: user.usernameInfo,
        passwordInfo: user.passwordInfo,
        usernameSchedule: user.usernameSchedule,
        passwordSchedule: user.passwordSchedule,
        start_date,
        end_date,
        output_dir: outputDir,
        remove_future: removeFuture,
        remove_dayoff: removeDayOff
      };

      // Get file paths from Python
      const result = await invoke<ProcessingResult>('run_python', { params });
      
      // Read the JSON files
      const combinedData = JSON.parse(await readTextFile(result.combined_json));
      const summaryData = JSON.parse(await readTextFile(result.summary_json));

      setState({
        combined: combinedData,
        summary: summaryData,
        error: null
      });
    }, { errorMessage: 'Failed to process data' }, setState);
  };

  return (
    <section id="paramsSection" className="processing-section">
      <h2>Processing Parameters</h2>
      <form id="processingForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Date Range</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="thisMonth"
              name="dateRange"
              value="thisMonth"
              checked={selectedRange === 'thisMonth'}
              onChange={(e) => setSelectedRange(e.target.value as DateRange)}
            />
            <label className="form-check-label" htmlFor="thisMonth">
              This Month
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="thisMonthTillToday"
              name="dateRange"
              value="thisMonthTillToday"
              checked={selectedRange === 'thisMonthTillToday'}
              onChange={(e) => setSelectedRange(e.target.value as DateRange)}
            />
            <label className="form-check-label" htmlFor="thisMonthTillToday">
              This Month Till Today
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="custom"
              name="dateRange"
              value="custom"
              checked={selectedRange === 'custom'}
              onChange={(e) => setSelectedRange(e.target.value as DateRange)}
            />
            <label className="form-check-label" htmlFor="custom">
              Custom Range
            </label>
          </div>
        </div>

        {selectedRange === 'custom' && (
          <div id="customDates" className="mb-3">
            <div className="row">
              <div className="col">
                <label htmlFor="start_date" className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="start_date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="end_date" className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="end_date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="output_dir" className="form-label">Output Directory</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="output_dir_display"
              value={outputDir}
              readOnly
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleChooseDir}
            >
              Choose Directory
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="removeFuture"
              checked={removeFuture}
              onChange={(e) => setRemoveFuture(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="removeFuture">
              Remove Future Dates
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="removeDayOff"
              checked={removeDayOff}
              onChange={(e) => setRemoveDayOff(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="removeDayOff">
              Remove Days Off
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Process Data</button>
      </form>
    </section>
  );
} 