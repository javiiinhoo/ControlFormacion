from django.contrib.auth.hashers import make_password
from .models import User
from django.db.models import Max, Q
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils.timezone import timedelta
from datetime import datetime
from django.conf import settings
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.contrib import messages
from django.core.signing import Signer
from unidecode import unidecode
from django.http import Http404
from rest_framework import status
import hashlib
import os
from django.contrib.auth import authenticate, login, logout
from .serializers import ChangePasswordSerializer, RegisterSerializer,  TransferListSerializer
from .models import Log,  Transfer,  TransferList


import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response


import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response


class GalleryImagesView(APIView):
    def get(self, request):
        # Obtener la ruta de la carpeta de la galería
        gallery_folder = os.path.join(settings.MEDIA_ROOT, 'gallery')

        # Verificar si la carpeta existe
        if not os.path.exists(gallery_folder):
            print(gallery_folder)
            # La carpeta no existe, devolver una lista vacía
            return Response([])

        # Obtener la lista de archivos en la carpeta de la galería
        gallery_files = os.listdir(gallery_folder)

        # Filtrar solo los archivos de imagen
        image_files = [file for file in gallery_files if file.endswith(
            ('.jpg', '.jpeg', '.png', '.gif'))]

        # Construir la lista de URLs de las imágenes de la galería
        image_urls = [request.build_absolute_uri(os.path.join(
            settings.MEDIA_URL, 'gallery', file)) for file in image_files]

        return Response(image_urls)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Crea un nuevo usuario y perfil asociado
            user = serializer.save()
            login(request, user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            signer = Signer()
            authtoken = hashlib.sha256(signer.sign(
                f"{username}:{password}").encode('utf-8')).hexdigest()
            response = Response({'detail': 'Inicio de sesión exitoso'})
            response.set_cookie('authtoken', authtoken, max_age=86400,
                                secure=True, httponly=True, samesite='Strict', path='/')
            return response
        else:
            return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        # Cierra la sesión del usuario y elimina la cookie de autenticación
        logout(request)
        response = Response({'success': 'Sesión cerrada exitosamente.'})
        response.delete_cookie('authtoken')
        return response


class CurrentUserView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            is_authenticated = True
            username = user.username
            first_name = user.first_name
            last_name = user.last_name
            email = user.email
            is_admin = user.is_superuser
            return Response({'id': user.id, 'is_authenticated': is_authenticated,  'username': username, 'email': email, 'is_admin': is_admin, 'first_name': first_name, 'last_name': last_name})
        else:
            is_authenticated = False
            return Response({'detail': 'Usuario no autenticado'}, status=status.HTTP_401_UNAUTHORIZED)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            password_actual = serializer.validated_data['oldPassword']
            new_password = serializer.validated_data['newPassword']
            user = request.user
            if user.check_password(password_actual):
                if password_actual == new_password:
                    return Response({'detail': 'La nueva contraseña debe ser diferente a la contraseña actual'}, status=status.HTTP_400_BAD_REQUEST)
                elif new_password != serializer.validated_data['confirmNewPassword']:
                    return Response({'detail': 'La nueva contraseña y su confirmación no coinciden'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    user.set_password(new_password)
                    user.save()
                    messages.success(
                        request, 'La contraseña ha sido cambiada exitosamente')
                    return Response({'detail': 'Contraseña cambiada exitosamente'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminPanelView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        script = request.GET.get('script')
        query = Q()
        if script == 'players':
            query &= Q(script='players')
        elif script == 'scraper':
            query &= Q(script='scraper')
        logs = Log.objects.filter(query)
        logs_data = {'logs': [{'date': log.date.strftime(
            '%Y-%m-%d %H:%M:%S'), 'changes_detected': log.changes_detected, 'script': script}for log in logs]}
        return Response(logs_data)


class UserManagementView(APIView):
    def get(self, request):
        users = User.objects.all()
        data = [
            {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_superuser': user.is_superuser
            }
            for user in users
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        password = data['password']
        hashed_password = make_password(password)  # Hash the password
        user = User.objects.create(
            username=data['username'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=hashed_password,  # Use the hashed password
            is_superuser=data['is_superuser']
            # Otros campos de usuario
        )
        return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            data = request.data
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.email = data['email']
            user.is_superuser = data['is_superuser']
            # Actualizar otros campos de usuario si es necesario
            user.save()
            return Response({'message': 'Usuario actualizado exitosamente'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'Usuario eliminado exitosamente'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class PlayerSearchView(APIView):
    def get(self, request):
        transfers_in_db = Transfer.objects.all()
        if transfers_in_db.exists():
            six_weeks_ago = datetime.now() - timedelta(weeks=6)
            try:
                last_log_date = Log.objects.filter(
                    script='scraper').aggregate(Max('date'))['date__max']
                if last_log_date is not None and last_log_date.date() < six_weeks_ago.date():
                    return Response({'message': 'La base de datos de jugadores no se ha actualizado en más de 6 semanas. Por favor, contacte con el administrador.'}, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({'message': 'Hay jugadores en la base de datos y se han actualizado en las últimas 6 semanas.'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'message': 'Error al obtener la fecha del último log del script scraper.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'message': 'No se encontraron jugadores en la base de datos. Por favor, contacte con el administrador.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        # Obtiene el nombre del jugador del cuerpo de la solicitud
        nombre_jugador = request.data.get('nombre')
        if nombre_jugador:
            # Convierte el nombre del jugador a ASCII
            nombre_jugador_ascii = unidecode(nombre_jugador)
            # Filtra las transferencias por coincidencia en el nombre o en el nombre ASCII
            transfers = Transfer.objects.filter(
                Q(nombre__icontains=nombre_jugador) | Q(nombre__icontains=nombre_jugador_ascii))
            if not transfers:  # Comprueba si no hay transferencias que coincidan
                # Devuelve un mensaje indicando que no se encontraron jugadores con ese nombre
                return Response({'message': 'No se encontraron jugadores con ese nombre.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                # Serializa las transferencias encontradas
                serialized_transfers = list(transfers.values())
                # Devuelve las transferencias serializadas en la respuesta
                return Response({'jugadores': serialized_transfers}, status=status.HTTP_200_OK)
        else:
            # Devuelve un mensaje indicando que no se teclearon jugadores
            return Response({'message': 'No se ha tecleado ningún nombre, por favor inserte un nombre.'}, status=status.HTTP_404_NOT_FOUND)


class PlayerTransfersView(APIView):
    def get(self, request, nombre):
        # Elimina los espacios en blanco alrededor del nombre del jugador
        nombre_jugador = nombre.strip()
        # Convierte el nombre del jugador a ASCII
        nombre_jugador_ascii = unidecode(nombre_jugador)

        if nombre_jugador:
            transfers = Transfer.objects.filter(
                Q(nombre__icontains=nombre_jugador) |
                Q(nombre__icontains=nombre_jugador_ascii)
            )  # Filtra las transferencias por coincidencia en el nombre o en el nombre ASCII
        else:
            transfers = Transfer.objects.all()  # Obtiene todas las transferencias

        if transfers.exists():
            # Serializa las transferencias encontradas
            serialized_transfers = list(transfers.values())
            # Devuelve las transferencias serializadas en la respuesta
            return Response({'transfers': serialized_transfers}, status=status.HTTP_200_OK)
        else:
            # Lanza una excepción Http404 si no se encontraron transferencias para este jugador
            raise Http404('No se encontraron transfers para este jugador.')


class TransferListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transfer_lists = TransferList.objects.all()
        data = []
        for transfer_list in transfer_lists:
            serialized_data = TransferListSerializer(transfer_list).data
            owner_id = transfer_list.user_id
            owner_username = User.objects.get(id=owner_id).username
            serialized_data['username'] = owner_username
            data.append(serialized_data)
        return Response(data)

    def post(self, request, id=None):
        if not id:
            # Crear una nueva lista
            serializer = TransferListSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user_id=request.data['user_id'])
                return Response({"message": "Lista creada con éxito."}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Agregar un transfer a una lista existente
            try:
                transfer_list = TransferList.objects.get(id=id)
                # Suponiendo que tienes un campo 'transfer_id' en los datos de la solicitud
                transfer_id = request.data.get('transfer').get('id')

                try:
                    transfer = Transfer.objects.get(id=transfer_id)
                    transfer_list.transfers.add(transfer)
                    serializer = TransferListSerializer(transfer_list)
                    return Response({"message": "Transfer agregado con éxito a la lista."}, status=status.HTTP_200_OK)
                except Transfer.DoesNotExist:
                    return Response({"error": "El objeto de transferencia no existe."}, status=status.HTTP_400_BAD_REQUEST)

            except TransferList.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id):
        try:
            transfer_list = TransferList.objects.get(id=id)
            transfer_list.delete()
            return Response({"message": "Lista eliminada con éxito."}, status=status.HTTP_204_NO_CONTENT)
        except TransferList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
