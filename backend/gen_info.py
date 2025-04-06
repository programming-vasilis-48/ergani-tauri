import requests
from dataclasses import dataclass
from typing import Dict, Any, Tuple
import logging

class ApiError(Exception):
    """Base exception for API-related errors"""
    pass

class AuthenticationError(ApiError):
    """Authentication failures"""
    pass

class DataProcessingError(Exception):
    """Data processing failures"""
    pass

@dataclass
class ApiConfig:
    base_url: str = "https://trialeservices.yeka.gr/WebServicesAPI/api"
    auth_endpoint: str = "/Authentication"
    service_endpoint: str = "/WebServices/ExecuteService"

class ApiClient:
    def __init__(self, config: ApiConfig):
        self.config = config
        self.session = requests.Session()
        self.token = None

    def authenticate(self, username: str, password: str, user_type: str) -> None:
        url = f"{self.config.base_url}{self.config.auth_endpoint}"
        payload = {"Username": username, "Password": password, "UserType": user_type}
        try:
            response = self.session.post(url, json=payload, headers=self._base_headers())
            response.raise_for_status()
            self.token = response.json()["accessToken"]
        except (requests.RequestException, KeyError) as e:
            raise AuthenticationError(f"Authentication failed: {str(e)}")

    def fetch_service_data(self, service_code: str) -> Dict[str, Any]:
        if not self.token:
            raise AuthenticationError("Authentication required first")
        url = f"{self.config.base_url}{self.config.service_endpoint}"
        payload = {"ServiceCode": service_code, "Parameters": []}
        try:
            response = self.session.post(url, json=payload, headers=self._auth_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise ApiError(f"API request failed for {service_code}: {str(e)}")

    def _base_headers(self) -> Dict[str, str]:
        return {"Content-Type": "application/json"}

    def _auth_headers(self) -> Dict[str, str]:
        return {**self._base_headers(), "Authorization": f"Bearer {self.token}"}

class DataProcessor:
    @staticmethod
    def process_employer(raw_data: Dict) -> Dict:
        try:
            employer = raw_data["EX_BASE_01"]["Ergodotis"]
            return {
                employer["Afm"]: {
                    "Id": employer["Id"],
                    "Eponimia": employer["Eponimia"],
                    "Ame": employer["Ame"]
                }
            }
        except KeyError as e:
            raise DataProcessingError(f"Missing employer key: {str(e)}")

    @staticmethod
    def process_branch(raw_data: Dict, afm: str) -> Dict:
        try:
            return {afm: raw_data["EX_BASE_02"]["Pararthma"]}
        except KeyError as e:
            raise DataProcessingError(f"Missing branch key: {str(e)}")

class InfoGenerator:
    def __init__(self, client: ApiClient):
        self.client = client

    def execute(self) -> Tuple[Dict, Dict]:
        employer_data = self._process_employer()
        branch_data = self._process_branch(employer_data)
        return employer_data, branch_data

    def _process_employer(self) -> Dict:
        raw_data = self.client.fetch_service_data("EX_BASE_01")
        return DataProcessor.process_employer(raw_data)

    def _process_branch(self, employer_data: Dict) -> Dict:
        afm = next(iter(employer_data))
        raw_data = self.client.fetch_service_data("EX_BASE_02")
        return DataProcessor.process_branch(raw_data, afm)

def gen_info(usernameInfo, passwordInfo):
    config = ApiConfig()
    api_client = ApiClient(config)
    
    try:
        api_client.authenticate(usernameInfo, passwordInfo, "02")
        generator = InfoGenerator(api_client)
        employer_data, branch_data = generator.execute()
        logging.info("Operation completed successfully")
        return employer_data, branch_data
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        raise
