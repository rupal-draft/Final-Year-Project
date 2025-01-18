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
    return jsonify({
        "aac_output": output_aac,
        "pcp_output": output_pcp,
        "ser_output": output_ser,
        "sep_output": output_sep
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
