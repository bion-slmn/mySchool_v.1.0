from .base import *
import os

SECRET_KEY = 'django-insecure-176^ld3n3jq@=nr=cfzhk45z1^lwr%-w4=zb#-=k72y(3%sk29'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),  # This will create a database file in the project root
    }
}


ALLOWED_HOSTS = ['*']
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]


