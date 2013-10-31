#!/usr/bin/env python
 # -*- coding: utf-8 -*-

from pymongo import MongoClient
from bson import json_util


class MongoImporter:

    def __init__(self, coll):
        mongo = MongoClient()
        self.collection = mongo.ivw[coll]

    def insert_json(self, data):
        line = str(data).replace("'", '"')
        self.collection.insert(json_util.loads(line))
