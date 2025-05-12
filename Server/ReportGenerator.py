import google.generativeai as genai
from dotenv import load_dotenv
import os
import pandas as pd
import json
import re


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class DrugRepurposingReporter:
    def __init__(self, csv_path: str):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        self.csv_path = csv_path

    def get_drug_ids(self, uniprot_id: str):
        df = pd.read_csv(self.csv_path)
        row = df[df["UniProt ID"] == uniprot_id]
        if row.empty:
            return None
        return row.iloc[0]["Drug IDs"].split("; ")

    def generate_report(self, drug_ids: list[str]) -> str:
        prompt = (
            f"For the following DrugBank IDs: {', '.join(drug_ids)}, provide:\n"
            "- Drug name\n"
            "- A short description of its function\n"
            "- Any known evidence or peer-reviewed articles supporting its potential use in cancer drug repurposing "
            "(include links if available)\n\n"
            "Respond in JSON format like this:\n"
            "[\n"
            "  {\n"
            "    \"drugId\": \"DB0001\",\n"
            "    \"name\": \"ExampleName\",\n"
            "    \"description\": \"Short description...\",\n"
            "    \"evidence\": [\"https://link1.com\", \"https://link2.com\"]\n"
            "  },\n"
            "  ...\n"
            "]"
        )

        response = self.model.generate_content(prompt)
        return response.text.strip()

    def extract_json_from_markdown(self, markdown_response: str):
        try:
            json_block = re.search(r"```json\n(.*?)\n```", markdown_response, re.DOTALL)
            if not json_block:
                raise ValueError("No JSON block found in response.")

            raw_json = json_block.group(1)
            return json.loads(raw_json)

        except Exception as e:
            raise ValueError(f"Error parsing Gemini JSON: {str(e)}")

    def extract_disclaimer(self, markdown_response: str):
        match = re.search(r"```json\n.*?\n```(.*)", markdown_response, re.DOTALL)
        if match:
            disclaimer = match.group(1).strip()
            return disclaimer
        return None