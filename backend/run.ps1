# Backend run script for Windows PowerShell
$env:PYTHONPATH = "$PSScriptRoot"
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
