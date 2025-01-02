import os
from dotenv import load_dotenv

load_dotenv()

print(os.getenv('DJANGO_ENV'), 111111111111111111)
if os.getenv('DJANGO_ENV') == 'production':
    from .production import *
else:
    from .development import *