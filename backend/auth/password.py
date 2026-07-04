"""Password hashing utilities for authentication."""

from passlib.context import CryptContext


password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain-text password with bcrypt."""

    return password_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verify a plain-text password against a stored bcrypt hash."""

    return password_context.verify(plain_password, password_hash)
