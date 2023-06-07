from django.db import models
from django.contrib.auth.models import User


class Transfer(models.Model):
    nombre = models.CharField(max_length=100)
    enlace = models.URLField()
    temporada = models.CharField(max_length=10)
    fecha = models.CharField(max_length=20)
    ultimo_club = models.CharField(max_length=100)
    nuevo_club = models.CharField(max_length=100)
    valor_mercado = models.CharField(max_length=20)
    coste = models.CharField(max_length=40)
    def __str__(self): return self.nombre


class Log(models.Model):
    SCRIPT_CHOICES = ('players', 'players'), ('scraper', 'scraper')
    date = models.DateTimeField(auto_now_add=True)
    script = models.CharField(max_length=50, choices=SCRIPT_CHOICES)
    changes_detected = models.TextField()
    def __str__(self): return f"{self.script} - {self.date}"


class TransferList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    transfers = models.ManyToManyField(Transfer)

    def __str__(self):
        return self.name
