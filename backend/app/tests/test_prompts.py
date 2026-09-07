from fastapi.testclient import TestClient

from app.main import app


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
    assert prompts[0]["thumbnailUrl"] == "/images/mock/jibli-1.jpg"


def test_get_prompt_detail():
    with TestClient(app) as client:
        response = client.get("/api/prompts/text-organize-1")

    assert response.status_code == 200
    assert response.json()["createdAt"] == "2026-09-05T09:00:00+09:00"
