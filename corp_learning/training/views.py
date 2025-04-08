from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login
from .models import CustomUser, TrainingModule, Gamification
from .serializers import CustomUserSerializer, TrainingModuleSerializer, GamificationSerializer

# class LoginView(APIView):
#     permission_classes = [permissions.AllowAny]
#
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             serializer = CustomUserSerializer(user)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'username': user.username, 'email': user.email})
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.create_user(username=username, email=email, password=password)
        # Create initial gamification record for the new user.
        Gamification.objects.create(user=user)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ModuleListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Create default modules if they don't exist
        if TrainingModule.objects.count() == 0:
            TrainingModule.objects.bulk_create([
                TrainingModule(
                    title="Fire Safety Training",
                    content="Learn the basic fire safety guidelines and emergency procedures."
                ),
                TrainingModule(
                    title="Annual Compliance",
                    content="Review annual compliance requirements and procedures."
                ),
                TrainingModule(
                    title="Sexual Harassment and Bullying",
                    content="Understand policies on sexual harassment, bullying, and appropriate workplace conduct."
                ),
                TrainingModule(
                    title="Communication",
                    content="Learn effective communication strategies for a collaborative work environment."
                ),
                TrainingModule(
                    title="Investment Banking Training",
                    content="In-depth training on investment banking practices, tailored for investment banking professionals."
                )
                ])
        # Retrieve all modules
        modules = TrainingModule.objects.all()
        # Filter out Investment Banking Training for non-Investment banking users.
        # Assumes request.user has a "division" attribute.
        if not (hasattr(request.user, 'division') and request.user.division.lower() == "investment banking"):
            modules = modules.exclude(title__iexact="Investment Banking Training")
        serializer = TrainingModuleSerializer(modules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GamificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            gamification = Gamification.objects.get(user=request.user)
            serializer = GamificationSerializer(gamification)
            return Response(serializer.data)
        except Gamification.DoesNotExist:
            return Response(
                {"detail": "No gamification data for this user."},
                status=status.HTTP_404_NOT_FOUND
            )


@csrf_exempt
def update_quiz_view(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            points_earned = int(data.get('pointsEarned', 0))
            time_taken = int(data.get('timeTaken', 0))

            # Get or create the gamification record for this user
            from .models import Gamification
            gamification, created = Gamification.objects.get_or_create(user=request.user)

            gamification.points += points_earned
            gamification.total_quiz_time += time_taken
            gamification.save()

            return JsonResponse({"detail": "Quiz data updated."}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

class LeaderboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Order first by descending points, then ascending total quiz time so lower time is better.
        leaderboard = Gamification.objects.all().order_by('-points', 'total_quiz_time')
        serializer = GamificationSerializer(leaderboard, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)