#!/usr/bin/env python
 # -*- coding: utf-8 -*-

from __future__ import print_function
from datetime import date
from pyquery import PyQuery
from csvparser import CustomParser
from verlagscraper import VerlagScraper
import mechanize
import string
import time
import urllib


class IVWScraper:

    def __init__(self, year, complete):
        # init global variables
        self.overview_url = 'http://daten.ivw.eu/index.php?menuid='
        self.complete = complete
        self.year = year
        # init browser
        self.browser = mechanize.Browser()

        # add useragent
        self.browser.addheaders = [(
            'User-agent',
            'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1)' +
            'Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1'
        )]

        # create an object to scrape the names
        VerlagScraper()
        if complete:
            for single_year in range(1998, date.today().year):
                self.year = single_year
                print ("Scraping the year " + str(single_year))
                self.__start_scraper()
        else:
            self.__start_scraper()

    def __start_scraper(self):
        self.csv_parser = CustomParser(year=self.year)
        for char in string.lowercase:
            attempts = 0
            while (attempts <= 5):
                try:
                    if (self.year == date.today().year) and not self.complete:
                        now = True
                    else:
                        now = False
                    self.__get_csv(letter=str(char), now=now)
                    print ("Scraping: " + str(char))
                    time.sleep(10)
                    break
                except (mechanize.HTTPError, mechanize.URLError) as err:
                    attempts = attempts + 1
                    print (err)
                    if (attempts <= 5):
                        print("I'll try again soon")
                        time.sleep(600)
                        continue
                    else:
                        print("The server doesn't respond")
                        raise
        self.csv_parser.parse_csv()

    def __get_csv(self, letter='a', now=False):

        #open the url
        current_url = self.overview_url + '1111&b=' + letter
        overview_req = mechanize.Request(current_url)
        overview_res = mechanize.urlopen(overview_req)

        #find the list of entries to post
        py_query = PyQuery(overview_res.read())
        titlelist = py_query("input[name='titelnrliste']").val()

        #create the post request
        post_data = {
            'url': current_url,
            'download': '[Download]',
            'titelnrliste': titlelist
        }

        if (now):
            #find the checked box (the current quartal)
            default_quartal = py_query(".quartal input:checked").attr('name')
            post_data[str(default_quartal)] = 'ON'
        else:
            #enable all quartal's checkbox
            quartals = [1, 2, 3, 4]
            for i in quartals:
                if i in range(1, 5):
                    post_data[str(self.year) + str(i)] = 'ON'

        #send the post request
        csv_req = mechanize.Request(current_url, urllib.urlencode(post_data))
        csv_res = mechanize.urlopen(csv_req)
        self.csv_parser.process_result(response=csv_res)
