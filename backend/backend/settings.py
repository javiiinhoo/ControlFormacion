import os
import pymysql
from pathlib import Path
pymysql.install_as_MySQLdb()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = 'django-insecure-0=y+po-8@&x2tz4n)qnwoug50yo=a7x-&!!x#gn(f-46uwy0!2'
DEBUG = True
ALLOWED_HOSTS = []
INSTALLED_APPS = ['django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes', 'django.contrib.sessions',
                  'django.contrib.messages', 'django.contrib.staticfiles', 'rest_framework', 'corsheaders', 'django_cron', 'api']
CRON_CLASSES = ['api.cron.ScriptCronJob']
MIDDLEWARE = ['django.contrib.sessions.middleware.SessionMiddleware', 'django.middleware.security.SecurityMiddleware', 'django.middleware.common.CommonMiddleware', 'django.middleware.csrf.CsrfViewMiddleware',
              'django.contrib.auth.middleware.AuthenticationMiddleware', 'django.contrib.messages.middleware.MessageMiddleware', 'corsheaders.middleware.CorsMiddleware', 'django.middleware.clickjacking.XFrameOptionsMiddleware']
REST_FRAMEWORK = {'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.BasicAuthentication',
                                                     'rest_framework.authentication.SessionAuthentication', 'rest_framework.authentication.TokenAuthentication']}
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
SESSION_COOKIE_HTTPONLY = False
AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
ASGI_APPLICATION = 'backend.routing.application'
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
ROOT_URLCONF = 'backend.urls'
TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates', 'DIRS': [], 'APP_DIRS':True, 'OPTIONS':{'context_processors': ['django.template.context_processors.debug',
                                                                                                                                           'django.template.context_processors.request', 'django.contrib.auth.context_processors.auth', 'django.contrib.messages.context_processors.messages']}}]
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
SESSION_COOKIE_HTTPONLY = False
AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']
CORS_ORIGIN_WHITELIST = ['http://localhost:3000']
CSRF_ALLOWED_ORIGINS = ['http://localhost:3000']
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
CSRF_ORIGIN_WHITELIST = ['http://localhost:3000']
CORS_ORIGIN_WHITELIST = ['http://localhost:3000']
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
WSGI_APPLICATION = 'backend.wsgi.application'
DATABASES = {'default': {'ENGINE': 'django.db.backends.mysql', 'NAME': 'rcdformacion',
                         'USER': 'root', 'PASSWORD': '1234', 'HOST': 'localhost', 'PORT': '3306'}}
AUTH_PASSWORD_VALIDATORS = [{'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'}, {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'}, {
    'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'}, {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'}]
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
STATIC_DIR = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR,'api','media')
MEDIA_URL = '/media/'
STATICFILES_DIRS = [STATIC_DIR]
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'api', 'static')
STATICFILES_DIRS = []
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
