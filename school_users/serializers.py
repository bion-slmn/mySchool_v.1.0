from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import (
    validate_password, password_validators_help_texts)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['name'] = user.first_name
        if hasattr(user, 'schools'):
            token['school'] = user.schools.name

        return token


class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True, format="%Y-%m-%d")
    last_login = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")
    password = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(choices=User.SchoolRoles.choices)

    class Meta:
        model = User
        exclude = ["groups", "user_permissions"]

    def validate_password(self, value: str) -> str:
        """
        Validate the password using Django's password validators.
        """
        try:
            validate_password(value)
        except Exception as e:
            help_text = password_validators_help_texts()
            raise serializers.ValidationError(
                f"Password validation error: {', '.join(e.messages)}\nHelp text: {help_text}"
            ) from e
        return value

    def validate_role(self, value: str) -> str:
        """
        Validate the role field to ensure it is one of the allowed choices.
        """
        if value not in dict(User.SchoolRoles.choices):
            raise serializers.ValidationError("Invalid role. Choose either 'admin' or 'teacher'.")
        return value

    def create(self, validated_data: dict) -> User:
        """
        Create and return a new `User` instance with a hashed password.
        """
        password = validated_data.pop('password', None)
        self.validate_password(password)
        
        user = User(**validated_data)
        user.set_password(password)
        
        user.save()
        return user

    def update(self, instance: User, validated_data: dict) -> User:
        """
        Update and return an existing `User` instance, given the validated data.

        passowrd is deleted if present
        """
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
