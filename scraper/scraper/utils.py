#!/usr/bin/env python
 # -*- coding: utf-8 -*-

from pygeocoder import Geocoder
from pymongo import MongoClient
from datetime import date
import os
import time
import shutil
import argparse


class DropAndClean():
    def __init__(self):
        mongo = MongoClient()
        self.db = mongo.ivw
        self.__drop()

    def __drop(self):
        self.db.zeitung.drop()
        self.db.verlag.drop()
        self.db.city.drop()
        if os.path.exists("./rec"):
            shutil.rmtree("./rec")


class MongoAggregate():
    def __init__(self):
        mongo = MongoClient()
        db = mongo.ivw
        self.incollection = db.zeitung
        self.outcollection = db.city
        self.__process()

    def __process(self):
        allcities = self.incollection.distinct("Ort")
        citycoord = self.__georeference(allcities)
        for year in range(1998, date.today().year + 1):
            for quartal in range(1, 5):
                citylist = {}
                cities = self.incollection.find(
                    {"Quartal": str(year) + str(quartal), "Kennzeichen_Statistik": "11"}).distinct("Ort")
                for city in cities:
                    sold = self.incollection.find(
                        {"Quartal": str(year) + str(quartal),
                         "Ort": str(city),
                         "Kennzeichen_Statistik": "11"},
                        {"_id": 0, "Verbreitung": 1})
                    endsold = 0
                    for data in sold:
                        if data.get("Verbreitung"):
                            endsold = endsold + int(data["Verbreitung"])

                    citylist = {
                        "quartal": str(year) + str(quartal),
                        "city": city,
                        "publisher": str(len(self.incollection.find(
                            {"Jahr": str(year),
                             "Ort": str(city)}).distinct("Verlagsnummer"))),
                        "sold": str(endsold),
                        "lat": str(citycoord[city][0].coordinates[0]),
                        "lng": str(citycoord[city][0].coordinates[1])
                    }
                    self.outcollection.insert(dict(citylist))

    def __georeference(self, cities):
        citycoord = {}
        for city in cities:
            citycoord[city] = Geocoder.geocode(city)
            time.sleep(1)
        return citycoord


class ReplacePublishersId():
    def __init__(self):
        mongo = MongoClient()
        db = mongo.ivw
        self.newspapers = db.zeitung
        self.publishers = db.verlag
        self.results = db.results
        #self.__replace()
        self.__result()

    def __replace(self):
        for publisher in self.publishers.find({"title": {"$regex": "&"}}):
            self.publishers.update({"title": publisher["title"]},
                              {"$set": {"title": publisher["title"].replace("&", "und")}})

        for publisherId in self.newspapers.find().distinct("Verlagsnummer"):
            result = publishers.find({"vid": publisherId}).distinct("title")
            self.newspapers.update({"Verlagsnummer": publisherId},
                              {"$set": {"Verlagsnummer": result[0]}},
                              multi=True)

    def __result(self):
        for year in range(1998, date.today().year + 1):
            for quartal in range(1, 5):
                tosearch = str(year) + str(quartal)
                result = 0
                for value in self.newspapers.find({"Quartal": tosearch, "Kennzeichen_Statistik": "11"}).distinct("Verbreitung"):
                    result = result + int(value)
                    
                self.results.insert({"_id": tosearch, "value": result})

def main():
    parser = argparse.ArgumentParser(description="Utils for the IVW-Scraper")

    parser.add_argument("-c",
                        "--clean",
                        action="store_true",
                        help="Cleans the mongo database and delete ./rec")

    parser.add_argument("-a",
                        "--aggregate",
                        action="store_true",
                        help="Returns only 1 field from the mongodb")

    args = parser.parse_args()

    if (args.clean):
        DropAndClean()
    elif (args.aggregate):
        ReplacePublishersId()
        #MongoAggregate()

if __name__ == "__main__":
    main()
