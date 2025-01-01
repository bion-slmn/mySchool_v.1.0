from .base import *
from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

DATABASES = {
    "default": dj_database_url.parse(os.environ.get("DATABASE_URL"))
}

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

