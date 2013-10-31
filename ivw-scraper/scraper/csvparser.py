#!/usr/bin/env python
 # -*- coding: utf-8 -*-

from __future__ import print_function
import csv
import os
from mongoimporter import MongoImporter


class CustomParser:

    def __init__(self, year):
        self.year = year
        self.resdir = os.getcwd() + "/rec/"
        if not os.path.exists(self.resdir):
            os.makedirs(self.resdir)
        self.outfile = file(self.resdir + str(self.year) + '.csv', 'a+')

        self.mongo = MongoImporter(coll="zeitung")
        self.headers = ("Quartal", "IVW_Nr", "Titel_Nr",
                        "Titel", "Zusatz", "Ort", "Verlagsnummer",
                        "Erscheinungsweise", "Kennzeichen_Statistik",
                        "Mitgliedsnummer", "Verbreitung", "Verkauf",
                        "Druckauflage_gesamt",
                        "Verkauf_zur_Weitergabe_an_Kunden", "Abo_gesamt",
                        "dav_Mehrf_25", "dav_Mitgl", "EV_Verkauf",
                        "EV_Lieferung", "Remittenden", "Lesezirkel",
                        "Bordexemplare", "Sonst_Verk", "Freist_gesamt",
                        "davon_ausgelegt", "Zahl_Auslege_Stellen",
                        "Reste/Belege", "Sonderhinweis",
                        "Verbreitung_(Ausland)", "Verkauf_(Ausland)",
                        "Druckauflage_gesamt_(A)",
                        "Verkauf_zur_Weitergabe_an_Kunden_(A)",
                        "Abo_gesamt_(A)", "dav_Mehrf_25_(A)",
                        "dav_Mitgl_(A)", "EV_Verkauf_(A)",
                        "EV_Lieferung_(A)", "Remittenden_(A)",
                        "Lesezirkel_(A)", "Bordexemplare_(A)",
                        "Sonst_Verk_(A)", "Freist_gesamt_(A)",
                        "davon_ausgelegt_(A)", "Zahl_Auslege_Stellen_(A)",
                        "Reste/Belege_(A)", "Sachgruppe", "Bindeauflage",
                        "VerkAuflage", "VertriebAb", "Postvert_gesamt",
                        "Postvert_CDROM", "Direktvertr_gesamt",
                        "Direktvertr_CDROM", "Verbreitung_gesamt",
                        "Verbreitung_CDROM", "Korrektur_KZ",
                        "Supplement_Gesamtverkauf",
                        "Supplement_Sonstige_Verbreitung_gesamt",
                        "Nicht_IVW_angeschlossene_Traegerobjekte",
                        "Bindeauflage_(CD)", "VerkAuflage_(CD)",
                        "Freist_gesamt_(CD)", "Erschienen",
                        "Hauptort", "ZIS_Schluessel/PZ_Nr")

    def process_result(self, response):
        output = response.read().replace(';', "','")
        decoded = output.decode("iso-8859-1")
        text = decoded.replace('\r\n', '\n')

        header = True
        for line in text.split('\n'):
            if (header):
                header = False
            elif (line):
                print ("'" + line.encode('utf-8') + "'", file=self.outfile)

    def parse_csv(self):
        with open(os.path.abspath(self.outfile.name), "rb") as f:
            reader = csv.reader(f, delimiter=",", quotechar="'",
                                lineterminator='\n', quoting=csv.QUOTE_NONE)
            for row in reader:
                i = 0
                post = {}
                while i < len(self.headers):
                    if row and (len(row) <= len(self.headers)):
                        if (row[i] != "''"):
                            post[self.headers[i]] = row[i].replace("'", "").replace("\xc3\x84", "AE").replace("\xc3\x96", "OE").replace("\xc3\x9c", "UE").replace("\xc3\xbc", "ue").replace("\xc3\xa4", "ae").replace("\xc3\xb6", "oe").replace("\xc3\x9f", "ss")
                        i = i + 1
                    else:
                        i = i + 1

                if post:
                    post["Jahr"] = str(self.year)
                    self.mongo.insert_json(data=post)
