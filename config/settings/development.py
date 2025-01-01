from .base import *

SECRET_KEY = 'django-insecure-176^ld3n3jq@=nr=cfzhk45z1^lwr%-w4=zb#-=k72y(3%sk29'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'postgres'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'mypassword'),
        'HOST': os.getenv('POSTGRES_HOST', 'db'),  # Use 'db' to match Docker Compose service name
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

ALLOWED_HOSTS = ['*']
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]


