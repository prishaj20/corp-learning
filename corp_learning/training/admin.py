from django.contrib import admin
from .models import CustomUser, TrainingModule, Gamification
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_adaptive']

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(TrainingModule)
admin.site.register(Gamification)