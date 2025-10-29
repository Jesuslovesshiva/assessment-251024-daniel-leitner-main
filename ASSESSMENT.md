# User Profile Feature

**Time Expectation:** ~4 hours

## Context

Our current `User` entity is a simplified example. In a real-world app, this would handle authentication and authorization (email, password, roles, permissions, etc.). We need to add profile information for employees - bio, employment details, profile pictures, etc.

**Task:** Keep `User` as-is for auth concerns, extend it with a new profile feature for employee data.

## Requirements

### Profile Data

- Bio (text)
- Position (string)
- Department (string)
- LinkedIn URL (optional)
- Profile picture via Gravatar (fetch by email MD5 hash, fallback to default avatar)

### Deliverables

- **Backend:** Profile entity (following existing patterns) + `GET/PATCH /api/users/:id/profile` endpoints
- **Frontend:** User list showing profile data (bio, position, department, Gravatar) + edit form
- **Database:** Prisma schema (1:1 with User) + migration + seed data (2-3 sample profiles)
- **Tests:** Unit tests for profile entity/service + E2E tests for API endpoints
- **Pull Request:** Feature branch with clean commits and brief description

## Important Notes

**Follow Existing Patterns:** The codebase uses clean architecture (entities, repositories, services, controllers). Follow these patterns.
**Boy Scout Rule:** Leave the codebase better than you found it. If you spot issues, bugs, or improvements - fix them. We value code quality and attention to detail.
**You Decide:** How to model relationships, implement privacy, and structure your code is up to you.
