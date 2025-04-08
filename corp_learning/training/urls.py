from django.urls import path
from .views import login_view, SignupView, ModuleListView, GamificationView, update_quiz_view, LeaderboardView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('modules/', ModuleListView.as_view(), name='modules'),
    path('gamification/', GamificationView.as_view(), name='gamification'),
    path('update-quiz/', update_quiz_view, name='update-quiz'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
]