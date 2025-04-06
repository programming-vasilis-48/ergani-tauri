from datetime import datetime, timedelta
from typing import Optional
import os, shutil, time, logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)

# Date handling
class DateHandler:
    @staticmethod
    def get_date_range(start_date: Optional[str] = None, end_date: Optional[str] = None) -> tuple:
        # If no start_date given, use today's month as before.
        if start_date is None:
            today = datetime.today()
            start_dt = today.replace(day=1)
        else:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        # If no end_date given, compute last day of start_dt's month.
        if end_date is None:
            last_day = (start_dt.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        else:
            last_day = datetime.strptime(end_date, "%Y-%m-%d")
        return (start_dt.strftime("%d/%m/%Y"), last_day.strftime("%d/%m/%Y"))


# Config and FileManager (unchanged)
class Config:
    TIMEOUTS = {
        'element': 20,
        'download': 45,
        'retries': 3
    }
    
    PATHS = {
        'downloads': None,
        'output': None
    }
    
    @classmethod
    def setup(cls, output_dir):
        # Use system temp directory for downloads
        cls.PATHS['downloads'] = os.path.join(os.path.abspath(os.path.expanduser('~')), 'AppData', 'Local', 'Temp', 'ergani_downloads')
        cls.PATHS['output'] = os.path.abspath(output_dir)
        os.makedirs(cls.PATHS['downloads'], exist_ok=True)
        os.makedirs(cls.PATHS['output'], exist_ok=True)
        
        # Ensure the download directory is empty
        for file in os.listdir(cls.PATHS['downloads']):
            file_path = os.path.join(cls.PATHS['downloads'], file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                logging.warning(f"Error cleaning download directory: {e}")

class FileManager:
    @staticmethod
    def wait_for_download(path, timeout=45, check_interval=1):
        end_time = time.time() + timeout
        while time.time() < end_time:
            if os.path.exists(path):
                return path
            time.sleep(check_interval)
        raise FileNotFoundError(f"File {path} not downloaded in {timeout}s")
    
    @staticmethod
    def safe_remove(path):
        if os.path.exists(path):
            os.remove(path)

# Browser and Scheduler classes
class BrowserManager:
    def __init__(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_experimental_option("prefs", {
            "download.default_directory": Config.PATHS['downloads'],
            "download.prompt_for_download": False,
        })
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, Config.TIMEOUTS['element'])
    
    def navigate(self, url):
        self.driver.get(url)
    
    def set_date_range(self, from_xpath, to_xpath, date_from, date_to):
        self._fill_field(By.XPATH, from_xpath, date_from)
        self._fill_field(By.XPATH, to_xpath, date_to)
        search_button_locator = (By.XPATH, "//input[@type='submit' and @value='Αναζήτηση']")
        self.wait.until(EC.element_to_be_clickable(search_button_locator))
        button = self.driver.find_element(*search_button_locator)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", button)
        self.driver.execute_script("arguments[0].click();", button)
        time.sleep(1)
    
    def login(self, username, password):
        self._fill_field(By.ID, 'ctl00_ctl00_ContentHolder_ContentHolder_SiteLogin_UserName', username)
        self._fill_field(By.ID, 'ctl00_ctl00_ContentHolder_ContentHolder_SiteLogin_Password', password)
        self._click(By.ID, 'ctl00_ctl00_ContentHolder_ContentHolder_SiteLogin_Login')
    
    def download_file(self):
        self._click(By.CLASS_NAME, 'ExcelExport')
    
    def _fill_field(self, by, locator, value):
        element = self.wait.until(EC.presence_of_element_located((by, locator)))
        element.click()
        element.send_keys(value)
        element.click()
        time.sleep(0.5)
    
    def _click(self, by, locator):
        element = self.wait.until(EC.element_to_be_clickable((by, locator)))
        element.click()
        time.sleep(0.5)
    
    def close(self):
        if self.driver:
            self.driver.quit()

class Scheduler:
    def __init__(self, output_dir, start_date: Optional[str] = None, end_date: Optional[str] = None):
        Config.setup(output_dir)
        self.browser = BrowserManager()
        # Use provided dates (format: YYYY-MM-DD) or default to today's month
        self.date_range = DateHandler.get_date_range(start_date, end_date)
        self.report_configs = {
            'actual': {
                'url': 'https://eservices.yeka.gr/WTO/Workcard/DailyWorkTimesSearch.aspx',
                'from_xpath': '//*[@id="igtxtctl00_ctl00_ContentHolder_ContentHolder_DailyWorkTimesSearchControl_DateFromEdit"]',
                'to_xpath': '//*[@id="igtxtctl00_ctl00_ContentHolder_ContentHolder_DailyWorkTimesSearchControl_DateToEdit"]'
            },
            'planned': {
                'url': 'https://eservices.yeka.gr/Mitroa/ErgazomenosWorkingSearch.aspx',
                'from_xpath': '//*[@id="igtxtctl00_ctl00_ContentHolder_ContentHolder_ErgazomenosWorkingSearchControl_DateFromEdit"]',
                'to_xpath': '//*[@id="igtxtctl00_ctl00_ContentHolder_ContentHolder_ErgazomenosWorkingSearchControl_DateToEdit"]'
            }
        }

    def execute(self, usernameSchedule, passwordSchedule):
        try:
            self._authenticate(usernameSchedule, passwordSchedule)
            return (
                self._process_report('planned'),
                self._process_report('actual')
            )
        except Exception as e:
            logging.error(f"Critical error: {str(e)}")
            raise
        finally:
            self.browser.close()

    def _authenticate(self, usernameSchedule, passwordSchedule):
        try:
            self.browser.navigate('https://eservices.yeka.gr/login.aspx?ReturnUrl=/')
            self.browser.login(
                usernameSchedule,
                passwordSchedule
            )
            WebDriverWait(self.browser.driver, 10).until(
                EC.url_contains("Default.aspx")
            )
        except Exception as e:
            logging.error("Authentication failed")
            raise

    def _process_report(self, report_type):
        config = self.report_configs[report_type]
        for attempt in range(Config.TIMEOUTS['retries']):
            try:
                logging.info(f"Processing {report_type} report (attempt {attempt+1})")
                self.browser.navigate(config['url'])
                self.browser.set_date_range(
                    config['from_xpath'],
                    config['to_xpath'],
                    *self.date_range
                )
                self.browser.download_file()
                return self._handle_download(report_type)
            except Exception as e:
                if attempt == Config.TIMEOUTS['retries'] - 1:
                    raise
                logging.warning(f"Attempt {attempt+1} failed: {str(e)}")
                time.sleep(2)

    def _handle_download(self, prefix):
        temp_filename = "Grid.xlsx"
        temp_path = os.path.join(Config.PATHS['downloads'], temp_filename)
        final_filename = f"{prefix}_{datetime.now().strftime('%d%m')}.xlsx"
        final_path = os.path.join(Config.PATHS['output'], final_filename)
        try:
            # Wait for download with increased timeout
            FileManager.wait_for_download(temp_path, Config.TIMEOUTS['download'])
            
            # Ensure the target directory exists
            os.makedirs(os.path.dirname(final_path), exist_ok=True)
            
            # If target file exists, remove it first
            if os.path.exists(final_path):
                os.remove(final_path)
                
            # Move the file
            shutil.move(temp_path, final_path)
            
            # Verify the move was successful
            if not os.path.exists(final_path):
                raise FileNotFoundError(f"Failed to move file to {final_path}")
                
            return final_path
        except Exception as e:
            logging.error(f"Error handling download: {e}")
            # Clean up temp file if it exists
            FileManager.safe_remove(temp_path)
            raise

def run_scheduler(output_dir: str, usernameSchedule, passwordSchedule, start_date: Optional[str] = None, end_date: Optional[str] = None):
    return Scheduler(output_dir, start_date, end_date).execute(usernameSchedule, passwordSchedule)
