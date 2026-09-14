import httpx
from fastapi import HTTPException
from app.core.config import get_settings

settings = get_settings()

def send_email(to_email: str, code: str):
    print(">>> Brevo API 발신자:", settings.mail_from or settings.mail_username)

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": settings.brevo_api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    payload = {
        "sender": {"email": settings.mail_from or settings.mail_username, "name": "#키워드"},
        "to": [{"email": to_email}],
        "subject": "#키워드 이메일 인증번호",
        "textContent": f"인증번호는 [{code}] 입니다.",
    }

    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        print("이메일 전송 에러 상세:", e.response.text)
        raise HTTPException(
            status_code=500,
            detail=f"메일 발송 실패: {e.response.text}",
        )
    except Exception as e:
        print("이메일 전송 에러 상세:", e)
        raise HTTPException(status_code=500, detail=f"메일 발송 실패: {str(e)}")