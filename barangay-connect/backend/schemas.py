from pydantic import BaseModel

class UserLogin(BaseModel):
    phone: str
    password: str

class TokenData(BaseModel):
    access_token: str
    token_type: str
    role: str
