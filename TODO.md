# Authentication Module TODO

## Milestone 1: Security Foundation

- [x] Create security configuration for JWT settings.
- [x] Create bcrypt password hashing utilities.
- [x] Create JWT access token helpers.

## Milestone 2: User SQLAlchemy Model

- [x] Create normalized user table model.
- [x] Create admin and employee role enum.
- [x] Add uniqueness and lookup indexes.

## Milestone 3: Pydantic Auth Schemas

- [x] Create signup request validation.
- [x] Create login request validation.
- [x] Create token and public user response schemas.

## Milestone 4: Authentication Service

- [x] Implement duplicate email handling.
- [x] Prevent public admin signup unless explicitly enabled.
- [x] Implement bcrypt password hashing during signup.
- [x] Implement login credential verification.
- [x] Implement JWT generation after successful login.

## Milestone 5: Dependencies and Permissions

- [x] Implement database session dependency.
- [x] Implement current user dependency.
- [x] Implement active user protection.
- [x] Implement reusable role and permission checks.

## Milestone 6: Auth API Routes

- [x] Implement POST /auth/signup.
- [x] Implement POST /auth/login.
- [x] Implement GET /auth/me.

## Milestone 7: Build Verification and Integration Cleanup

- [x] Add package initialization files.
- [x] Keep scope limited to authentication-related files.
- [x] Run Python syntax verification once Python is available on PATH.
