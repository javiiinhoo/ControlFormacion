import os
import subprocess
from datetime import datetime
from urllib.parse import urlparse
from django_cron import CronJobBase, Schedule
from .models import Log, Transfer


class ScriptCronJob(CronJobBase):
    RUN_EVERY_MINS = 60*24*7
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'api.script_cron_job'

    def do(self):
        script_path_players = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), 'scripts', 'players.py')
        script_path_scraper = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), 'scripts', 'scraper.py')

        try:
            links_file_path = os.path.join(os.path.dirname(
                os.path.abspath(__file__)), 'data', 'links.txt')
            with open(links_file_path, 'r')as links_file:
                existing_links = [link.strip()
                                  for link in links_file.readlines()]
            subprocess.run(['python', script_path_players], check=True)
            players_log_file = os.path.join(os.path.dirname(
                os.path.abspath(__file__)), 'data', 'players_log.txt')
            with open(players_log_file, 'r')as file:
                current_players_log = file.readlines()
                current_players_log = [player_log.strip()
                                       for player_log in current_players_log]
            new_players_log = [
                player_log for player_log in current_players_log if player_log not in existing_links]
            if new_players_log:
                changes_detected_players = '\n'.join(
                    f"Jugador añadido: {urlparse(player_log).path.split('/')[-4].replace('-',' ').title()}"for player_log in new_players_log)
            else:
                changes_detected_players = 'No se encontraron nuevos jugadores para analizar.'
            log_players = Log(
                script='players', changes_detected=changes_detected_players, date=datetime.now())
            log_players.save()
            log_file_path = os.path.join(os.path.dirname(
                os.path.abspath(__file__)), 'data', 'players_log.txt')
            if os.path.isfile(log_file_path):
                os.remove(log_file_path)
        except (subprocess.CalledProcessError, FileNotFoundError)as e:
            print(f"Error al ejecutar la actualización: {str(e)}")

        try:
            subprocess.run(['python', script_path_scraper],
                           check=True, timeout=400000)
            csv_file_path = os.path.join(os.path.dirname(
                os.path.abspath(__file__)), 'data', 'cantera.csv')
            if os.path.isfile(csv_file_path):
                with open(csv_file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()[1:]
                    transfers = []
                    for line in lines:
                        data = line.strip().split(',')
                        transfer = Transfer(
                            nombre=data[0],
                            enlace=data[1].strip(),
                            temporada=data[2],
                            fecha=data[3],
                            ultimo_club=data[4],
                            nuevo_club=data[5],
                            valor_mercado=data[6],
                            coste=data[7]
                        )
                        existing_transfer = Transfer.objects.filter(
                            nombre=transfer.nombre, temporada=transfer.temporada, fecha=transfer.fecha, ultimo_club=transfer.ultimo_club,
                            nuevo_club=transfer.nuevo_club, valor_mercado=transfer.valor_mercado, coste=transfer.coste).first()
                        if existing_transfer:
                            continue  # En caso de ya existir en la db saltamos el transfer y no se guarda
                        transfer.save()
                        transfers.append(
                            f"Nuevo traspaso de {transfer.nombre} el {transfer.fecha}")
                os.remove(csv_file_path)
                log_players = Log(
                    script='scraper',
                    changes_detected='Datos actualizados:\n' +
                    '\n'.join(transfers),
                    date=datetime.now()
                )
                log_players.save()
            else:
                print('CSV no encontrado.')
        except subprocess.CalledProcessError as e:
            print(f"Error al ejecutar el script scraper.py: {str(e)}")
