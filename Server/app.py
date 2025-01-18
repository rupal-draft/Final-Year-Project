from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os
import tempfile
from Pfeature import aac_wp, pcp_wp, ser_wp, sep_wp

load_dotenv()

cors_origin = os.getenv("FLASK_CORS_ORIGIN", "*")

app = Flask(__name__)
CORS(app, origins=[cors_origin], methods=["GET", "POST", "OPTIONS"])

import pandas as pd
from flask import Flask, request, jsonify


@app.route('/api/detect-protein', methods=['POST'])
def detect_protein():
    data = request.json
    sequence = data.get('sequence')
    fasta_content = convert_to_fasta(sequence)
    fasta_file_path = save_fasta_to_file(fasta_content)
    output_aac = "output_aac.csv"
    output_pcp = "output_pcp.csv"
    output_ser = "output_ser.csv"
    output_sep = "output_sep.csv"
    aac_wp(fasta_file_path, output_aac)
    pcp_wp(fasta_file_path, output_pcp)
    ser_wp(fasta_file_path, output_ser)
    sep_wp(fasta_file_path, output_sep)
    df_aac = pd.read_csv(output_aac)
    df_pcp = pd.read_csv(output_pcp)
    df_ser = pd.read_csv(output_ser)
    df_sep = pd.read_csv(output_sep)
    merged_df = pd.concat([df_aac, df_pcp, df_ser, df_sep], axis=1)
    merged_output = "merged_output.csv"
    merged_df.to_csv(merged_output, index=False)
    os.remove(output_aac)
    os.remove(output_pcp)
    os.remove(output_ser)
    os.remove(output_sep)
    return jsonify({
        "merged_output": merged_output
    })


def convert_to_fasta(sequence, identifier="Protein_1"):
    fasta_format = f">{identifier}\n{sequence}"
    return fasta_format

def save_fasta_to_file(fasta_content):
    temp_file = tempfile.NamedTemporaryFile(delete=False, mode="w", suffix=".fasta")
    temp_file.write(fasta_content)
    temp_file.close()
    return temp_file.name

if __name__ == '__main__':
    app.run(debug=True)
