import os
import dj_database_url

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
print(os.environ.get("DATABASE_URL"), 1111111111)

DATABASES = {
    "default": dj_database_url.parse(os.environ.get("DATABASE_URL"))
}

DEBUG = False

CON_MAX_AGE = 600

