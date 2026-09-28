# Directives (Layer 1: What to do)

Directives are Standard Operating Procedures (SOPs) written in Markdown. They define human intent and specify the rules, inputs, tools, outputs, and edge cases for automated or semi-automated execution.

## Structure of a Directive

Each directive should define:
1. **Goal**: Clearly stated objective.
2. **Inputs**: Parameters, input files, environment variables, or schemas required.
3. **Tools / Scripts**: Deterministic scripts located in `execution/` to run.
4. **Execution Flow**: Step-by-step instructions for the Orchestrator (Layer 2) to follow.
5. **Outputs & Deliverables**: Expected output format, location (cloud deliverables or local intermediates).
6. **Edge Cases & Error Handling**: Known failure modes, rate limits, fallback steps.

## Operating Rules for Directives

- **Living Documents**: Update directives whenever new API constraints, edge cases, timing expectations, or optimal workflows are discovered.
- **Do not discard**: Directives are your instruction set; improve them over time rather than using them extemporaneously.
- **Template**: Use [`_template.md`](./_template.md) when drafting new directives.
