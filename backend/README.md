# Party Bus Quoting Chatbot Backend

## Setup

1. Install dependencies:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```
2. Run the server:
   ```powershell
   ./run.ps1
   ```

- The API will be available at http://localhost:8000
- Main endpoint: `/quote`

## Environment Variables
- Place any secrets (API keys, etc.) in a `.env` file in this folder.

## Development
- Edit `app.py` for backend logic.
- Vehicle data: `../vehicles.csv`

---

See `project-spec.md` for full requirements and quoting rules.
