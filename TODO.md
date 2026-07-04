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

## Backend Integration Milestone 2: Bootstrap and Auth Integration

- [x] Create FastAPI application entrypoint.
- [x] Configure environment-driven application settings.
- [x] Configure SQLAlchemy database engine and session management.
- [x] Register authentication routes in the FastAPI app.
- [x] Configure CORS.
- [x] Add Alembic migration setup.
- [x] Add initial users table migration.
- [x] Add authentication and security tests.
- [x] Verify imports and Python compilation.
- [x] Verify tests pass.
- [x] Verify OpenAPI exposes authentication endpoints.
- [x] Verify Uvicorn startup and Swagger UI availability.

## Remaining Backend Tasks

- [ ] Run `alembic upgrade head` against a real PostgreSQL database.
- [ ] Commit and push `feature/authentication-module`.
- [ ] Open a pull request into `develop`.
- [ ] Wait for approval before starting Milestone 3.
