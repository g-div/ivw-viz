#!~/.virtualenvs/beiw/bin/python
 # -*- coding: utf-8 -*-

from flask import Flask
from flask.ext.restful import Api, Resource, request
from flask.ext.pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
from utils import CrossOriginResourceSharing
import ast
import os
import json


app = Flask("ivw")
api = Api(app)

app.config = json.load(open(os.path.abspath('./config.json')))

mongo = PyMongo(app)

# CORS-allowed domains
allowed = (
    'http://localhost:8080',
)

# Add Access Control Header
cors = CrossOriginResourceSharing(app)
cors.set_allowed_origins(*allowed)


def toJson(data):
    return ast.literal_eval(json_util.dumps(data))


class Entry(Resource):
    def get(self):
        result = {'Kennzeichen_Statistik': '11'}
        title = request.args.get('t', None)
        if title:
            result['Titel'] = title
        year = request.args.get('y', None)
        if year:
            result['Jahr'] = year
        ort = request.args.get('o', None)
        if ort:
            result['Ort'] = ort
        quartal = request.args.get('q', None)
        if quartal:
            result['Quartal'] = quartal
        verlag = request.args.get('v', None)
        if verlag:
            result['Verlagsnummer'] = verlag
        #erscheinung = request.args.get('e', None)
        # if erscheinung:
        #     result['Erscheinungsweise'] = erscheinung
        entries = mongo.db.zeitung.find(result)
        return toJson(entries)


class EntryId(Resource):
    def get(self):
        nid = request.args.get('oid', None)
        if nid:
            entry = mongo.db.zeitung.find({"_id": ObjectId(nid)})
        return toJson(entry)


class Verlag(Resource):
    def get(self):
        vid = request.args.get('id', None)
        if vid:
            entry = mongo.db.verlag.find({"vid": vid})
        return toJson(entry)


class Geo(Resource):
    def get(self):
        entry = mongo.db.geo.find_one()
        return toJson(entry)


class City(Resource):
    def get(self):
        quartal = request.args.get('q', None)
        if quartal:
            entry = mongo.db.city.find({"quartal": quartal})
        return toJson(entry)


class Result(Resource):
    def get(self):
        entry = mongo.db.results.find()
        return toJson(entry)


api.add_resource(Entry, '/api/zeitung/')
api.add_resource(EntryId, '/api/zeitung/id/')
api.add_resource(Verlag, '/api/verlag/')
api.add_resource(City, '/api/geo/cities/')
api.add_resource(Geo, '/api/geo/de.json')
api.add_resource(Result, '/api/result/result.json')

if __name__ == "__main__":
    app.run(debug=True)
