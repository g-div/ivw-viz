from ivw import IVWScraper
from datetime import date
import argparse


def main():
    parser = argparse.ArgumentParser(description='Scrape the IVW Website')

    parser.add_argument('-y',
                        '--year',
                        metavar='YYYY',
                        type=int,
                        help='The year to scrape')

    parser.add_argument('-n',
                        '--now',
                        action='store_true',
                        help='Scrape the current year')

    parser.add_argument('-c',
                        '--complete',
                        action='store_true',
                        help='Scrape the complete IVW archive')

    args = parser.parse_args()

    if (args.year):
        if (2000 <= args.year <= date.today().year):
            IVWScraper(year=args.year, complete=False)
        else:
            print ("Please give a correct year. In the form YYYY, e.g. 2012")

    elif (args.now):
        IVWScraper(year=date.today().year, complete=False)

    elif (args.complete):
        IVWScraper(year=date.today().year, complete=True)

    else:
        print ('Run "./ivw.py --h" or "./ivw.py --help"' +
               ' to learn how to use this script')

if __name__ == "__main__":
    main()
