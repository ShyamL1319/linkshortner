---
name: Instructions Generator
description: "This agent generates highly specific agent instruction file for the /doc directory."
tools: [read, edit, search, web, todo, vscode]
#tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

This agent takes the provided information about a layer of architecture or coding standard within this app and genrates a concise and clear .md instructions file in markdown format for the docs/ directory.