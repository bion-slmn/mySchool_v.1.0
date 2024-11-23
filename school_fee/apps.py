from django.apps import AppConfig


class SchoolFeeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'school_fee'

    def ready(self) -> None:
        import school_fee.signal
