import smtplib
from email.mime.text import MIMEText
from fastapi import HTTPException
from app.core.config import get_settings

settings = get_settings()

def send_email(to_email: str, code: str):
    print(">>> 현재 적용된 메일 서버:", settings.mail_server)
    print(">>> 현재 적용된 계정:", settings.mail_username)
    print(">>> 비밀번호 존재 여부:", bool(settings.mail_password))
    try:
        # TLS(587) 연결
        smtp = smtplib.SMTP(settings.mail_server, settings.mail_port)
        smtp.starttls()
        smtp.login(settings.mail_username, settings.mail_password)
        
        msg = MIMEText(f"인증번호는 [{code}] 입니다.")
        msg['Subject'] = "#키워드 이메일 인증번호"
        msg['From'] = settings.mail_from or settings.mail_username
        msg['To'] = to_email
        
        smtp.sendmail(settings.mail_username, to_email, msg.as_string())
        smtp.quit()
    except Exception as e:
        print("이메일 전송 에러 상세:", e)
        raise HTTPException(status_code=500, detail=f"메일 발송 실패: {str(e)}")