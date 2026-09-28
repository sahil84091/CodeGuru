# Directive: [Task / Workflow Name]

## 1. Goal
[Describe clearly what this SOP achieves and the intended end result.]

## 2. Inputs & Prerequisites
- **Inputs**: [e.g., query, user ID, data source path]
- **Environment Variables**: [e.g., API keys required in `.env`]
- **Intermediate Storage**: `.tmp/[workflow_name]/`

## 3. Tools & Scripts
- Deterministic script: `execution/[script_name].py`
- Auxiliary tools: [e.g., CLI commands, DB client]

## 4. Execution Steps
1. **Prepare Inputs**: Validate parameters and ensure environment variables are present.
2. **Execute Script**: Run the deterministic tool:
   ```bash
   python execution/[script_name].py --input <param>
   ```
3. **Validate Results**: Check return codes, logs, and output schemas.
4. **Deliver / Export**: Save final outputs to designated cloud or deliverable target.

## 5. Outputs & Deliverables
- **Deliverables**: [e.g., Google Sheet, API response, generated artifact]
- **Intermediates**: [Stored in `.tmp/` and safe to delete]

## 6. Edge Cases & Error Handling
- **Known Issue / Rate Limit**: [Solution or batching strategy]
- **Self-Annealing Log**: [Document any past errors, learnings, or fixes applied here]
