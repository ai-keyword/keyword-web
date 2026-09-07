from sqlalchemy import Column, Integer, String
from app.core.database import Base


from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    prompts = relationship("Prompt", back_populates="author")
    liked_prompts = relationship("Prompt", secondary="user_likes", back_populates="liked_by_users")