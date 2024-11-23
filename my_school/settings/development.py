"""
Django settings for my_school project.

Generated by 'django-admin startproject' using Django 4.2.10.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

import os
from dotenv import load_dotenv


load_dotenv()


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(os.path.dirname(os.path.dirname(__file__)), "db.sqlite3"),
    }
}

# debug is set to True
DEBUG = True


