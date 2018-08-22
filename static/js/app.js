String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

var app = angular.module('stockDemoApp', ['ui.slider']);

app.controller('stockDemoCtrl', function($scope, $log, $http) {

    $scope.demoVals = {
        tickerName: '',
        sliderIncrement: .01,
        sliderTime: [32400, 37800]
    };

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
        if ($scope.demoVals.tickerName === ''){
            return false;
        }
        
        if ($scope.demoVals.sliderIncrement === null || $scope.demoVals.sliderIncrement === undefined){
            return false;
        }
        
        $scope.loading = true;

        data_url_base = "/data_volumebyprice"
        data_param = $scope.demoVals.sliderTime[0] + '-' + $scope.demoVals.sliderTime[1] + '/' + $scope.demoVals.tickerName + '/' + String($scope.demoVals.sliderIncrement).replace('.','_')
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

