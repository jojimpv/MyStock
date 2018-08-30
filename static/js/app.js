var app = angular.module('stockDemoApp', ['ngMaterial', 'ngMessages']);
app.controller('stockDemoCtrl', function($scope, $log, $http) {

    $scope.tickerName = ''
    $scope.sliderIncrement = .01
    $scope.sliderTimeStart = '09:30:00.0'
    $scope.sliderTimeEnd = '12:00:00.0'

    $scope.getTS = function(ts){
        var tstxt;
        tstxt = String(ts).toHHMMSS();
        return tstxt
    };
    
    $scope.ticker_names = []
    data_url = '/data_tickers'
    $scope.loading = true;
    
    $http.get(data_url).then(function(response) {
        angular.forEach(response.data.result.tickers, function(i){
            $scope.ticker_names.push(i);
        })
    });
    
    $scope.loading = false;
    
    $scope.change_ticker = function(){
        if ($scope.tickerName === ''){
            return false;
        }
        
        if ($scope.sliderIncrement === null || $scope.sliderIncrement === undefined){
            return false;
        }
        
        $scope.loading = true;

        data_url_base = "/data_volumebyprice"
        data_param = String($scope.sliderTimeStart).replace('.','_').replace(/:/g,'_') + '/' + String($scope.sliderTimeEnd).replace('.','_').replace(/:/g,'_') + '/' + $scope.tickerName + '/' + String($scope.sliderIncrement).replace('.','_')
        data_url = data_url_base + '/' + data_param
        $http.get(data_url).then(function(response) {
            $scope.volume = response.data.result.volume;
            $scope.prices = response.data.result.prices;
            $scope.loading = false;
            myChart = Highcharts.chart('graph_container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Stock Price by Volume'
                },
                xAxis: {
                    categories: $scope.prices
                },
                yAxis: {
                    title: {
                        text: 'Sum'
                    }
                },
                series: [{
                    name: 'Volume',
                    data: $scope.volume
                }]
            });
        });
    };

});

