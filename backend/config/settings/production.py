from .base import *
from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

url = "postgresql://schoool_test_user:ulWj70BIZM0Y68GmrPUpNfrDbSWGzWby@dpg-ctqp845ds78s73dgtkt0-a.oregon-postgres.render.com/schoool_test"
DATABASES = {
    "default": dj_database_url.parse(url)
}

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

