"""Database seeding utilities for pre-populating mock users."""

from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.models.user import User, UserRole
from backend.auth.password import hash_password


def seed_db_on_startup(db: Session) -> None:
    """Pre-populate the database with standard admin and employee accounts if empty."""

    # Guard: check if any users exist
    exists = db.scalars(select(User).limit(1)).first()
    if exists:
        return

    # Mock accounts credentials:
    # 1. Admin: admin@company.com / admin-password
    # 2. Engineer: engineer@company.com / engineer-password
    # 3. HR: hr@company.com / hr-password

    admin = User(
        full_name="Admin Director",
        email="admin@company.com",
        password_hash=hash_password("admin-password"),
        role=UserRole.ADMIN,
        department="Operations",
        is_active=True,
    )
    eng_user = User(
        full_name="Engineering Employee",
        email="engineer@company.com",
        password_hash=hash_password("engineer-password"),
        role=UserRole.EMPLOYEE,
        department="Engineering",
        is_active=True,
    )
    hr_user = User(
        full_name="HR Employee",
        email="hr@company.com",
        password_hash=hash_password("hr-password"),
        role=UserRole.EMPLOYEE,
        department="HR",
        is_active=True,
    )

    db.add_all([admin, eng_user, hr_user])
    db.commit()
    print("Database successfully seeded with mock accounts.")
