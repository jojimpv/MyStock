from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from collections import namedtuple, defaultdict
import logging
import csv
import os
import time


logger = logging.getLogger(__name__)
STOCK_DATA_PATH = os.path.join(settings.BASE_DIR, 'static', 'data', 'stock_data.csv')
STOCK_TICKETS = []
StockRec = namedtuple('StockRec', 'time ticker price size')


# Cache stock data
logger.info('Loading stock data started')
with open(STOCK_DATA_PATH) as stock_data_csv:
    stock_data_itr = csv.reader(stock_data_csv)
    stock_data = defaultdict(list)
    for row_num,row in enumerate(stock_data_itr):
        if row_num == 0:
            continue
        rec = StockRec(*row)
        stock_data[rec.ticker].append(rec)
        if rec.ticker not in STOCK_TICKETS:
            STOCK_TICKETS.append(rec.ticker)
        
    logger.info('Loading stock data completed')


def home(request):
    return render(request, 'stock_index.html')


def get_tickers(request):
    logger.info('Getting stock tickers data')
    result = dict(tickers=STOCK_TICKETS)
    message = 'OK'
    return JsonResponse(dict(status='Success',
                             result=result,
                             msg=message))


def get_volumeby_price(request, timeslot, ticker, increment):
    logger.debug('timeslot = {0}'.format(timeslot))
    logger.debug('ticker = {0}'.format(ticker))
    increment = float(increment.replace('_','.'))
    logger.debug('increment = {0}'.format(increment))
    time_start = time.strftime('%H:%M:%S.0', time.gmtime(int(timeslot.split('-')[0])))
    time_end = time.strftime('%H:%M:%S.0', time.gmtime(int(timeslot.split('-')[1])))
    logger.debug('time_slot = {0} - {1}'.format(time_start, time_end))
    stock_rec_filtered = []
    price_vol_map = defaultdict(int)
    for row_num,row in enumerate(stock_data[ticker]):
        if row_num == 0:
            continue
        rec = StockRec(*row)
        if rec.ticker == ticker and rec.time >= time_start and rec.time < time_end:
            stock_rec_filtered.append(rec)
    for rec in stock_rec_filtered:
        price_key = '{0:.2f}'.format(increment * round(float(rec.price)/increment))
        price_vol_map[price_key] += float(rec.size)
    result = dict(prices=list(price_vol_map.keys()), volume=list(price_vol_map.values()))
    message = 'OK'
    return JsonResponse(dict(status='Success',
                             result=result,
                             msg=message))