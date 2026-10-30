# Agent instructions
This file is the canonical agent instruction file for this repo. `.claude/CLAUDE.md` imports it (`@../AGENTS.md`) so that Claude Code picks it up too. Put shared instructions here; `.claude/CLAUDE.md` holds only the import plus any Claude-specific additions.

This file provides guidance to AI coding agents (Claude Code, etc.) when working with code in this repository.

## Documentation Conventions
- Keep docs concise and focused; avoid verbose explanations
- Save project memory/notes to repo docs (e.g., docs/, ADRs), NOT to internal Claude memory

## Decision-Making
- When you lack context to give a meaningful recommendation, ask clarifying questions instead of defaulting to agreement or giving a shallow answer
- Every recommendation must be backed by concrete reasoning — if you can't justify it, gather the missing context first

## Project Overview
Hardhat project with the GMRX vesting contracts (`TimeLockedWallet`, `TimeLockedWalletFactory`, `EngagementPortalBank`, `GmrxRate`) on BNB Chain, plus deploy/lock/withdraw scripts in `scripts/` fed by CSVs in `scripts/data/`. `README.md` describes the contracts and deployment order.
