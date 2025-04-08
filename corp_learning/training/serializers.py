from rest_framework import serializers
from .models import CustomUser, TrainingModule, Gamification

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'is_adaptive')

class TrainingModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingModule
        fields = '__all__'

class GamificationSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Gamification
        fields = ['username', 'points', 'badges', 'total_quiz_time']

    def get_username(self, obj):
        return obj.user.username