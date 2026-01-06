import os
import uuid
from typing import Optional, Tuple

import pytest
import requests
from dotenv import load_dotenv

load_dotenv()

DEFAULT_TIMEOUT = 10


def require_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        pytest.fail(f"Missing {key} in .env")
    return value


def extract_token_and_user_id(payload: dict) -> Tuple[Optional[str], Optional[str]]:
    token = payload.get("access_token")
    user_id = None

    user = payload.get("user")
    if isinstance(user, dict):
        user_id = user.get("id")

    session = payload.get("session")
    if isinstance(session, dict):
        token = token or session.get("access_token")
        session_user = session.get("user")
        if isinstance(session_user, dict):
            user_id = user_id or session_user.get("id")

    return token, user_id


class SupabaseSettings:
    def __init__(self) -> None:
        self.supabase_url = require_env("SUPABASE_URL").rstrip("/")
        self.anon_key = require_env("SUPABASE_ANON_KEY")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.functions_url = os.getenv(
            "SUPABASE_FUNCTIONS_URL",
            f"{self.supabase_url}/functions/v1",
        ).rstrip("/")
        self.rest_url = f"{self.supabase_url}/rest/v1"
        self.auth_url = f"{self.supabase_url}/auth/v1"
        self.storage_url = f"{self.supabase_url}/storage/v1"
        self.newsletter_function_url = os.getenv("SUPABASE_NEWSLETTER_FUNCTION_URL")
        self.profile_function_url = os.getenv("SUPABASE_PROFILE_FUNCTION_URL")

    def headers(self, token: Optional[str] = None) -> dict:
        headers = {"apikey": self.anon_key}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        return headers

    def function_url(self, name: str, override: Optional[str] = None) -> str:
        base = (override or self.functions_url).rstrip("/")
        if not base:
            pytest.fail("Missing SUPABASE_FUNCTIONS_URL")
        if base.endswith("/functions/v1"):
            return f"{base}/{name}"
        return f"{base}/{name}"

    def auth_signup(self, email: str, password: str) -> requests.Response:
        return requests.post(
            f"{self.auth_url}/signup",
            headers=self.headers(),
            json={"email": email, "password": password},
            timeout=DEFAULT_TIMEOUT,
        )

    def auth_signin(self, email: str, password: str) -> requests.Response:
        return requests.post(
            f"{self.auth_url}/token?grant_type=password",
            headers=self.headers(),
            json={"email": email, "password": password},
            timeout=DEFAULT_TIMEOUT,
        )

    def auth_user(self, token: str) -> requests.Response:
        return requests.get(
            f"{self.auth_url}/user",
            headers=self.headers(token),
            timeout=DEFAULT_TIMEOUT,
        )


def auth_user(settings: SupabaseSettings, email: str, password: str, token_env: str, id_env: str) -> dict:
    token_override = os.getenv(token_env)
    id_override = os.getenv(id_env)

    if token_override:
        user_id = id_override
        if not user_id:
            resp = settings.auth_user(token_override)
            if resp.ok:
                user_id = resp.json().get("id")
        if not user_id:
            pytest.fail(f"Missing {id_env} for {token_env} override")
        return {"email": email, "id": user_id, "token": token_override}

    signup_resp = settings.auth_signup(email, password)
    if signup_resp.ok:
        token, user_id = extract_token_and_user_id(signup_resp.json())
        if token and user_id:
            return {"email": email, "id": user_id, "token": token}

    signin_resp = settings.auth_signin(email, password)
    if signin_resp.ok:
        token, user_id = extract_token_and_user_id(signin_resp.json())
        if token and user_id:
            return {"email": email, "id": user_id, "token": token}

    pytest.fail(
        "Auth failed for test user. "
        f"Signup status {signup_resp.status_code}, Signin status {signin_resp.status_code}."
    )


def unique_slug(prefix: str) -> str:
    return f"pytest_{prefix}_{uuid.uuid4().hex[:12]}"


@pytest.fixture(scope="session")
def settings() -> SupabaseSettings:
    return SupabaseSettings()


@pytest.fixture(scope="session")
def auth_users(settings: SupabaseSettings) -> dict:
    user1 = auth_user(
        settings,
        require_env("TEST_USER_EMAIL_1"),
        require_env("TEST_USER_PASSWORD_1"),
        "TEST_USER_ACCESS_TOKEN_1",
        "TEST_USER_ID_1",
    )
    user2 = auth_user(
        settings,
        require_env("TEST_USER_EMAIL_2"),
        require_env("TEST_USER_PASSWORD_2"),
        "TEST_USER_ACCESS_TOKEN_2",
        "TEST_USER_ID_2",
    )
    return {"user1": user1, "user2": user2}
