"""MyStock URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from stock import views as stock_views


urlpatterns = [
    path('admin/', admin.site.urls),
    url('^$', stock_views.home),
    path('data_volumebyprice/<slug:timestart>/<slug:timeend>/<slug:ticker>/<slug:increment>/', stock_views.get_volumeby_price),
    path('data_tickers', stock_views.get_tickers),
]
