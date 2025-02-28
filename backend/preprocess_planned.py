import pandas as pd
from datetime import datetime, timedelta

class DataLoader:
    COLUMN_MAPPING = {
        "ΑΑ Παραρτηματος": "branch",
        "ΑΦΜ": "afm",
        "Όνομα": "first_name",
        "Επώνυμο": "last_name",
        "Ημ/νια": "date",
        "Απασχόληση": "work",
        "Διάλειμμα": "break"
    }
    
    def __init__(self, file_path):
        self.file_path = file_path
        
    def load(self):
        df = pd.read_excel(self.file_path, dtype={"ΑΦΜ": str})
        return df[list(self.COLUMN_MAPPING.keys())]\
                 .rename(columns=self.COLUMN_MAPPING)

class DateTimeHandler:
    @staticmethod
    def parse_shift_times(work_series):
        return work_series.str.extract(r'(\d{2}:\d{2})-(\d{2}:\d{2})')\
                         .rename(columns={0: 'start_time', 1: 'end_time'})

    @classmethod
    def create_datetime(cls, base_date, time_str):
        if pd.isna(time_str):
            return pd.NaT
        try:
            return datetime.combine(base_date.date(), 
                                  datetime.strptime(time_str, '%H:%M').time())
        except ValueError:
            return pd.NaT

class WorkTimeProcessor:
    SPECIAL_VALUES = ["ΑΝΑΠΑΥΣΗ/ΡΕΠΟ", "ΜΗ ΕΡΓΑΣΙΑ"]
    SPECIAL_TRANSLATIONS = {
        "ΑΝΑΠΑΥΣΗ/ΡΕΠΟ": "REST/DAY OFF",
        "ΜΗ ΕΡΓΑΣΙΑ": "NON-WORKING"
    }
    
    def __init__(self, df):
        self.df = df
        
    def process(self):
        self._extract_times()
        self._filter_data()
        self._adjust_clock_out()
        self._translate_break_values()
        self._format_output()
        return self.df
    
    def _extract_times(self):
        times = DateTimeHandler.parse_shift_times(
            self.df[~self.df['work'].isin(self.SPECIAL_VALUES)]['work']
        )
        self.df = pd.concat([self.df, times], axis=1)
        
        self.df['date'] = pd.to_datetime(self.df['date'], dayfirst=True)
        
        self.df['clock_in'] = self.df.apply(
            lambda x: DateTimeHandler.create_datetime(x['date'], x['start_time']),
            axis=1
        )
        self.df['clock_out'] = self.df.apply(
            lambda x: DateTimeHandler.create_datetime(x['date'], x['end_time']),
            axis=1
        )

    def _filter_data(self):
        self.df = self.df[
            self.df['work'].isin(self.SPECIAL_VALUES) |
            (self.df['clock_in'].notna() & self.df['clock_out'].notna())
        ]

    def _adjust_clock_out(self):
        valid_entries = self.df[~self.df['work'].isin(self.SPECIAL_VALUES)]
        mask = valid_entries['clock_out'] < valid_entries['clock_in']
        self.df.loc[mask.index[mask], 'clock_out'] += pd.Timedelta(days=1)

    def _translate_break_values(self):
        self.df['break'] = self.df['break'].fillna('')
        self.df['break'] = self.df['break'].str.replace(
            r'Εκτός (\d{2})', 'Outside \\1', regex=True
        ).str.replace(
            r'Εντός (\d{2})', 'Inside \\1', regex=True
        )

    def _format_output(self):
        # Create work status column
        self.df['work_status'] = self.df['work'].apply(
            lambda x: self.SPECIAL_TRANSLATIONS.get(x, "WORKING")
        )
        
        # Format clock times
        self.df['clock_in'] = self.df.apply(
            lambda row: row['clock_in'].isoformat() if row['work_status'] == "WORKING" else '',
            axis=1
        )
        self.df['clock_out'] = self.df.apply(
            lambda row: row['clock_out'].isoformat() if row['work_status'] == "WORKING" else '',
            axis=1
        )
        
        # Format date column
        self.df['date'] = self.df['date'].dt.strftime('%Y-%m-%d')
        
        # Final column order and sorting
        self.df = self.df.sort_values(['afm', 'date'])[
            ['branch', 'afm', 'last_name', 'first_name', 'date',
             'clock_in', 'clock_out', 'break','work_status']
        ].rename(columns={'work_status': 'work'})

class ExcelExporter:
    @staticmethod
    def save(df, output_path):
        df.to_excel(output_path, index=False)

def preprocess_planned_timetable(file_path):
    loader = DataLoader(file_path)
    processor = WorkTimeProcessor(loader.load())
    processed_df = processor.process()
    
    ExcelExporter.save(processed_df, file_path)
    return processed_df.to_dict(orient='records')