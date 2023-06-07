from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("gallery/", views.GalleryImagesView.as_view(), name="gallery"),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change-password"
    ),
    path("logs/", views.AdminPanelView.as_view(), name="admin-panel-logs"),
    path(
        "user-management/<int:user_id>/", views.UserManagementView.as_view(), name="user-management-users"
    ), path("user-management/", views.UserManagementView.as_view(), name="user-management"),

    path("player-search/", views.PlayerSearchView.as_view(), name="player-search"),
    path("player-transfers/<str:nombre>/",
         views.PlayerTransfersView.as_view(), name="player-transfers"),
    path('transfer-lists/', views.TransferListView.as_view(), name='transfer-lists'),
    path('transfer-lists/<int:id>/', views.TransferListView.as_view(),
         name='transfer-lists-delete'),
    path('transfer-lists/<int:id>/add-transfer/',
         views.TransferListView.as_view(), name='transfer-list-add-transfer'),
    path("current-user/", views.CurrentUserView.as_view(), name="current-user"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
