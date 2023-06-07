import os as A
import requests as U
from fake_useragent import UserAgent as T
from bs4 import BeautifulSoup as S
R = 'data'
K = 'a'
D = '\n'
C = set
B = open
h = 'scraper'
L = None
V = T()
W = {'user-agent': V.random}
X = ['https://www.transfermarkt.es/deportivo-la-coruna/alletransfers/verein/897', 'https://www.transfermarkt.es/deportivo-de-la-coruna-b/alletransfers/verein/11603',
     'https://www.transfermarkt.es/deportivo-de-la-coruna-u19/alletransfers/verein/14736', 'https://www.transfermarkt.es/deportivo-de-la-coruna-jugend/alletransfers/verein/25259']
E = []
for Y in X:
    Z = U.get(Y, headers=W)
    a = S(Z.content, 'html.parser')
    b = a.select('h2:-soup-contains("Bajas") + table')[:15]
    for c in b:
        d = c.find_all('tr')
        for e in d:
            M = e.find('td', class_='hauptlink')
            if M is not L:
                F = M.find(K)
                if F is not L:
                    f = F.get('title')
                    g = F.get('href')
                    if all(A not in f for A in ['RC Deportivo', 'RC Deportivo Fabril', 'RC Deportivo Juvenil A', 'RC Deportivo Fútbol Base']):
                        E.append('https://www.transfermarkt.es'+g)
G = A.path.join(A.path.dirname(A.path.abspath(__file__)), '..', R, 'links.txt')
if A.path.isfile(G):
    with B(G, 'r')as H:
        N = H.read().splitlines()
else:
    N = []
O = list(C(E)-C(N))
if len(O) > 0:
    with B(G, K)as H:
        H.write(D.join(O)+D)
I = A.path.join(A.path.dirname(A.path.abspath(__file__)),
                '..', R, 'players_log.txt')
if A.path.isfile(I):
    with B(I, 'r')as J:
        P = J.read().splitlines()
else:
    P = []
Q = list(C(E)-C(P))
if len(Q) > 0:
    with B(I, K)as J:
        J.write(D.join(Q)+D)
