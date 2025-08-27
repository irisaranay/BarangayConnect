from dotenv import load_dotenv
load_dotenv()

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Dict
import requests
import os

# Auth0 settings (you can load these from .env if you like)
AUTH0_DOMAIN = "dev-35h8lnajtnpacrds.us.auth0.com"  # e.g. barangayconnect.ap.auth0.com
AUTH0_AUDIENCE = "https://barangayconnect-api"
ALGORITHMS = ["RS256"]

# Token extractor
http_bearer = HTTPBearer()

# Get JWKS from Auth0 (public keys)
def get_jwks():
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    return requests.get(url).json()

# Decode and verify token
def verify_jwt(token: str) -> Dict:
    jwks = get_jwks()
    unverified_header = jwt.get_unverified_header(token)

    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }

    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=AUTH0_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/"
            )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token verification failed"
    )

# Dependency to protect routes
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer)
):
    token = credentials.credentials
    return verify_jwt(token)
