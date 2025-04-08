from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Extend user model as needed for adaptive learning
    is_adaptive = models.BooleanField(default=True)
    division = models.CharField(default='Engineering',max_length=255)

class TrainingModule(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    difficulty = models.IntegerField(default=1)  # 1: Easy, 2: Medium, 3: Hard

    def __str__(self):
        return self.title

class Gamification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    badges = models.JSONField(default=list)
    total_quiz_time = models.IntegerField(default=0)  # Total quiz time in seconds

    def __str__(self):
        return f"{self.user.username}'s Gamification Data"