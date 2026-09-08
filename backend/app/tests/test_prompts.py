from fastapi.testclient import TestClient

from app.core.database import SessionLocal
from app.core.security import create_access_token
from app.main import app
from app.models.user import User


def test_list_trending_keywords():
    with TestClient(app) as client:
        response = client.get("/api/keywords/trending")

    assert response.status_code == 200
    assert response.json()["keywords"] == ["지브리", "스파이더맨", "정리"]


def test_filter_image_prompts_by_keyword():
    with TestClient(app) as client:
        response = client.get("/api/prompts?keyword=지브리&type=image")

    prompts = response.json()["prompts"]

    assert response.status_code == 200
    assert len(prompts) == 4
    assert prompts[0]["id"] == "img-jibli-1"
    assert prompts[0]["thumbnail_url"] == "/images/mock/jibli-1.jpg"


def test_get_prompt_detail():
    with TestClient(app) as client:
        response = client.get("/api/prompts/text-organize-1")

    assert response.status_code == 200
    assert response.json()["created_at"].startswith("2026-09-05T09:00:00")


def test_get_me_returns_user_profile():
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == "profile-test@example.com").first()
        if not user:
            user = User(
                name="Profile Tester",
                username="profiletester",
                email="profile-test@example.com",
                password="hashed-password",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token({"sub": user.email})

    with TestClient(app) as client:
        response = client.get(
            "/getme",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "profile-test@example.com"
    assert body["username"] == "profiletester"
    assert isinstance(body["written_prompts"], list)
    assert isinstance(body["liked_prompts"], list)
