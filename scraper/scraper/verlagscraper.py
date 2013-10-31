#!/usr/bin/env python
 # -*- coding: utf-8 -*-

from mongoimporter import MongoImporter
from pyquery import PyQuery
import urlparse
import mechanize


class VerlagScraper:

    def __init__(self):
        self.current_url = 'http://daten.ivw.eu/index.php?menuid=13&b=alle'

        self.__get_html_data()

    def __get_html_data(self):
        verlag_req = mechanize.Request(self.current_url)
        verlag_res = mechanize.urlopen(verlag_req)
        mongo = MongoImporter(coll="verlag")

        py_query = PyQuery(verlag_res.read())
        link_list = py_query(".lz_r a")
        for link in link_list:
            query = urlparse.urlparse(py_query(link).attr('href')).query
            parsed_query = urlparse.parse_qs(query)
            vid = parsed_query['m'][0]
            title = parsed_query['t'][0].replace("Titel des Verlags ", "").replace('"', '')
            decoded = title.replace("'", "").replace("\xed", "i").replace("\xd6", "Oe").replace("\xf6g", "oe").replace("\xdc", "UE").replace("\xf6", "ue").replace("\xfc", "ue").replace("\xdf", "ss").replace("\xc4", "Ae").replace("\xfc", "ae").replace("\xe0", "a").replace("\xe4", "ae").replace("\xe9", "e")
            json = ({"vid": vid, "title": decoded})
            if decoded:
                mongo.insert_json(json)
