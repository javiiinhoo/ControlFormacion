import requests as Q
import os as C
import pandas as P
from bs4 import BeautifulSoup as T
from fake_useragent import UserAgent as S
from datetime import datetime as R
J = str
A = 'div'
L = 'data'
M = 'Nombre Jugador'
V = S()
W = {'user-agent': V.random}
i = []
N = []
X = C.path.join(C.path.dirname(C.path.abspath(__file__)), '..', L, 'links.txt')
with open(X, 'r')as Y:
    Z = [A.strip().replace('profil', 'transfers')for A in Y.readlines()]


def a(): A = R.now().year; B = [
    f"{J(A-1-B)[-2:]}/{J(A-B)[-2:]}"for B in range(10)]; return B


b = a()
for O in Z:
    F = {}
    G = T(Q.get(O, headers=W).content, 'html.parser')
    j = G.find(A, {'class': 'box viewport-tracking'})
    try:
        H = ' '.join([A.strip()if isinstance(A, J)else A.text.strip()for A in G.find(
            'h1', class_='data-header__headline-wrapper').contents if A.name != 'span'])
        if H is not None:
            F[M] = H.strip()
    except AttributeError:
        H = None
    F['Enlace TM'] = O
    c = G.find_all(A, class_='grid tm-player-transfer-history-grid')
    for D in c:
        I = D.find(
            A, class_='tm-player-transfer-history-grid__season').text.strip()
        if I in b or I == '22/23':
            B = F.copy()
            B['Temporada'] = I
            B['Fecha'] = D.find(
                A, class_='tm-player-transfer-history-grid__date').text.strip()
            B['Último club'] = D.find(
                A, class_='tm-player-transfer-history-grid__old-club').text.strip()
            B['Nuevo club'] = D.find(
                A, class_='tm-player-transfer-history-grid__new-club').text.strip()
            B['Valor de mercado'] = D.find(
                A, class_='tm-player-transfer-history-grid__market-value').text.strip().replace(' mil €','.000€').replace(' mill. €','0.000€').replace(',','.').replace('Tarifa de préstamo:','Tarifa')
            B['Coste'] = D.find(
                A, class_='tm-player-transfer-history-grid__fee').text.strip().replace(',','.')
            N.append(B)
E = P.DataFrame(N)
E = E.iloc[E[M].str.normalize('NFKD').argsort()]
d = C.path.join(C.path.dirname(C.path.abspath(__file__)),
                '..', L, 'cantera.csv')
E.to_csv(d, index=False)