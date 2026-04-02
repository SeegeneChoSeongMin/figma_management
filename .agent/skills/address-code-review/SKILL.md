---
name: address-code-review
description: Addresses code review feedback by fixing issues and replying to reviewer comments on GitHub PRs. Triggers on phrases like "address review", "fix review comments", "respond to PR feedback", "리뷰 반영", "리뷰 코멘트 수정".
---

# Address Code Review Skill

This skill guides you through addressing code review feedback on a GitHub Pull Request — fixing issues, applying suggestions, and replying to reviewer comments.

**Primary tooling**: GitHub CLI (`gh`).
**Fallback**: If `gh` commands fail (auth issues, rate limits, API errors), fall back to the GitHub MCP tools (`mcp_github_*`).

> **OS Note**: All commands use POSIX `sh` syntax. The agent must adapt variable substitution to the user's shell (e.g., `$VAR` for bash/zsh, `$env:VAR` or `$VAR` for PowerShell). Placeholders like `<PR_NUMBER>` and `<REPO>` should be replaced with actual values at runtime.

## 1. Initialization & Context

### Identify PR and Repository

Run the following commands (these are OS-agnostic `gh` CLI calls):

```sh
gh pr view --json number --jq .number
# → Store the result as PR_NUMBER

gh repo view --json nameWithOwner --jq .nameWithOwner
# → Store the result as REPO (e.g. "owner/repo-name")
# → Derive OWNER and REPO_NAME by splitting on "/"
```

If either command fails, abort and ask the user for the PR number.

**MCP Fallback**: Use `mcp_github_github_issue_read` with `method: "get"` to retrieve PR details.

### Ensure Branch is Up-to-Date

```sh
gh pr checkout <PR_NUMBER>
git pull
```

## 2. Gather All Review Feedback

Collect **all** review feedback in a single pass to build a complete picture before making any changes.

### 2a. Fetch Review Summaries

```sh
gh api repos/<REPO>/pulls/<PR_NUMBER>/reviews --jq ".[] | {id: .id, user: .user.login, state: .state, body: .body}"
```

**MCP Fallback**: Use `mcp_github_github_issue_read` with `method: "get_comments"` on the PR number.

### 2b. Fetch Inline Review Comments (Change Requests)

```sh
gh api repos/<REPO>/pulls/<PR_NUMBER>/comments --jq ".[] | {id: .id, user: .user.login, path: .path, line: .line, body: .body, in_reply_to_id: .in_reply_to_id, created_at: .created_at}"
```

### 2c. Fetch General PR Comments (Conversation)

```sh
gh api repos/<REPO>/issues/<PR_NUMBER>/comments --jq ".[] | {id: .id, user: .user.login, body: .body, created_at: .created_at}"
```

### 2d. Categorize Feedback

Organize all feedback into actionable categories using the `manage_todo_list` tool:

| Category       | Description                                                | Action Required     |
| -------------- | ---------------------------------------------------------- | ------------------- |
| **MUST FIX**   | `CHANGES_REQUESTED` reviews, critical bugs, blockers       | Code change + reply |
| **SHOULD FIX** | Suggestions with merit, style/convention issues            | Code change + reply |
| **DISCUSS**    | Questions, architecture debates, clarification requests    | Reply only          |
| **SKIP**       | Nits already resolved, outdated comments, resolved threads | No action           |

**CRITICAL**: Read ALL comments before starting any fixes. Understand the full scope of requested changes to avoid conflicting edits.

## 3. Address Feedback (The Fix Loop)

For each item in the todo list, follow this loop:

### Step A: Understand the Comment

1. Read the reviewer's comment carefully.
2. Open the referenced file and line using `read_file`.
3. Understand the surrounding context — don't fix in isolation.
4. If the comment references a project guideline, verify against the codebase conventions.

### Step B: Apply the Fix

1. Make the code change using file editing tools.
2. **Scope**: Only change what the reviewer asked for. Do not refactor unrelated code.
3. **If you disagree** with the feedback:
   - Do NOT silently ignore it.
   - Prepare a respectful reply explaining your reasoning (see Step C).
   - If the reviewer's suggestion conflicts with project conventions, cite the specific guideline.

### Step C: Reply to the Comment

After fixing (or deciding to discuss), reply to the **specific** review comment thread.

#### Reply to Inline Review Comments

```sh
# Reply to a specific review comment thread
gh api repos/<REPO>/pulls/<PR_NUMBER>/comments/<COMMENT_ID>/replies -f body="수정 완료했습니다! 확인 부탁드립니다~ ✅"
```

**MCP Fallback**: Use `mcp_github_github_add_issue_comment` with the PR number if inline reply fails, or `mcp_github_github_add_comment_to_pending_review` for review-level responses.

#### Reply to General PR Comments

```sh
gh api repos/<REPO>/issues/<PR_NUMBER>/comments -f body="리뷰 감사합니다! 말씀하신 부분 반영했습니다~ 🙏"
```

**MCP Fallback**: Use `mcp_github_github_add_issue_comment`.

### Step D: Mark as Done

Update the todo list to mark the item as completed before moving to the next one.

## 4. Reply Templates (Korean)

Use these standard phrasings when replying to reviewers. Adjust based on context.

| Situation                        | Template                                                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Fixed as requested**           | `수정 완료했습니다! 확인 부탁드립니다~ ✅`                                                                           |
| **Fixed with variation**         | `말씀하신 방향으로 수정했는데, [설명] 방식으로 적용했습니다. 확인 부탁드려요~ 🔧`                                    |
| **Agree but deferring**          | `좋은 제안 감사합니다! 이 부분은 별도 이슈로 분리해서 다음에 반영하겠습니다~ 📝`                                     |
| **Respectfully disagree**        | `의견 감사합니다! 다만 [근거/가이드라인]에 따라 현재 방식을 유지하는 것이 좋을 것 같습니다. 어떻게 생각하시나요? 🤔` |
| **Answering a question**         | `좋은 질문 감사합니다! [설명]입니다~ 💡`                                                                             |
| **Acknowledging with no change** | `확인했습니다! 이 부분은 [이유]로 현재 상태를 유지하겠습니다~ 🙏`                                                    |

## 5. Testing After Fixes

After all code changes are made:

1. **Run affected tests**:
   ```sh
   pnpm test:run <path-to-changed-files>
   ```
2. **Run full test suite** if changes are cross-cutting:
   ```sh
   pnpm test:run
   ```
3. If tests fail, fix them before proceeding.

## 6. Commit & Push

### Commit Strategy

- **Prefer a single commit** per review round to keep history clean.
- Use a descriptive commit message referencing the review:

```sh
git add -A
git commit -m "address code review feedback for PR #<PR_NUMBER>"
git push
```

- If changes are large and span multiple concerns, split into logical commits:

```sh
git add <files-for-concern-1>
git commit -m "fix: replace console.log with logger utility"

git add <files-for-concern-2>
git commit -m "refactor: extract business logic into custom hook"

git push
```

## 7. Final Summary Comment

After all fixes are pushed, post a summary comment on the PR.

Use the following template for the summary body:

```
리뷰 피드백 반영 완료했습니다! 🎉

### 변경 사항 요약
- ✅ [수정한 항목 1]
- ✅ [수정한 항목 2]
- 📝 [별도 이슈로 분리한 항목] → #IssueNumber
- 💬 [논의가 필요한 항목에 대한 의견]

확인 부탁드립니다~ 🙏
```

Post the comment:

```sh
gh pr comment <PR_NUMBER> --body "<SUMMARY>"
```

**MCP Fallback**: Use `mcp_github_github_add_issue_comment` with `owner`, `repo`, `issue_number` (PR number), and the summary as `body`.

## 8. Request Re-review (Optional)

If the reviewer explicitly requested changes, request a re-review:

```sh
# Get the reviewer(s) who requested changes
gh api repos/<REPO>/pulls/<PR_NUMBER>/reviews --jq '[.[] | select(.state=="CHANGES_REQUESTED") | .user.login] | unique | .[]'
# → For each reviewer returned, run:
gh pr edit <PR_NUMBER> --add-reviewer <REVIEWER>
```

## MCP Fallback Reference

When `gh` CLI commands fail, use these MCP tool mappings:

| gh CLI Command                                       | MCP Fallback Tool                                     |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `gh pr view`                                         | `mcp_github_github_issue_read` (method: get)          |
| `gh api repos/.../pulls/.../comments`                | `mcp_github_github_issue_read` (method: get_comments) |
| `gh api repos/.../issues/.../comments -f body="..."` | `mcp_github_github_add_issue_comment`                 |
| `gh pr comment`                                      | `mcp_github_github_add_issue_comment`                 |
| Review-level inline comments                         | `mcp_github_github_add_comment_to_pending_review`     |
| Search for related issues                            | `mcp_github_github_search_issues`                     |
