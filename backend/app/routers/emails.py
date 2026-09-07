from app.services.email_service import send_email

@app.post("/api/send-verification")
def send_verification_code(data: EmailRequest):
    code = "123456"  # 난수 생성 로직 적용
    send_email(data.email, code)
    return {"message": "인증번호가 발송되었습니다."}