"""Reusable role and permission checks for protected APIs."""

from collections.abc import Callable
from enum import Enum

from fastapi import Depends, HTTPException, status

from backend.auth.dependencies import get_current_active_user
from backend.models.user import User, UserRole


class Permission(str, Enum):
    """Business permissions controlled by user role."""

    UPLOAD_DOCUMENTS = "upload_documents"
    ACCESS_ANALYTICS = "access_analytics"
    MANAGE_KNOWLEDGE_BASE = "manage_knowledge_base"
    SEARCH_KNOWLEDGE = "search_knowledge"
    ASK_AI_QUESTIONS = "ask_ai_questions"


ROLE_PERMISSIONS: dict[UserRole, set[Permission]] = {
    UserRole.ADMIN: {
        Permission.UPLOAD_DOCUMENTS,
        Permission.ACCESS_ANALYTICS,
        Permission.MANAGE_KNOWLEDGE_BASE,
    },
    UserRole.EMPLOYEE: {
        Permission.SEARCH_KNOWLEDGE,
        Permission.ASK_AI_QUESTIONS,
    },
}


def has_permission(user: User, permission: Permission) -> bool:
    """Return whether the user role grants a permission."""

    return permission in ROLE_PERMISSIONS.get(user.role, set())


def require_roles(*roles: UserRole) -> Callable[[User], User]:
    """Create a dependency that allows only users with one of the roles."""

    allowed_roles = set(roles)

    def dependency(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role permissions.",
            )

        return current_user

    return dependency


def require_permission(permission: Permission) -> Callable[[User], User]:
    """Create a dependency that allows only users with a permission."""

    def dependency(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if not has_permission(current_user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permission.",
            )

        return current_user

    return dependency


require_admin = require_roles(UserRole.ADMIN)
require_employee = require_roles(UserRole.EMPLOYEE)
