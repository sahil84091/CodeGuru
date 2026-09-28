# Execution (Layer 3: Doing the work)

This directory contains deterministic Python scripts that perform the heavy lifting, such as data processing, API calls, file operations, and database interactions.

## Guidelines for Execution Scripts

1. **Deterministic & Testable**:
   - Pushing complexity into code prevents compounding LLM reasoning errors.
   - Scripts should accept arguments (e.g. via `argparse` or `sys.argv`), produce predictable output, and return standard exit codes (`0` on success, non-zero on error).
2. **Environment & Secrets**:
   - Never hardcode secrets. Load environment variables from `.env` (e.g., using `python-dotenv` or `os.environ`).
3. **Temporary Files**:
   - Store all temporary or intermediate processing files in `.tmp/`.
   - Never commit `.tmp/` files to Git.
4. **Self-Annealing**:
   - When a script encounters an unexpected error or API rate limit, fix the script, verify it with tests, and update the associated directive in `directives/`.
