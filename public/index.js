async function main() {

    let stockColors = [ 'rgba(61, 161, 61, 0.7)',
                        'rgba(209, 4, 25, 0.7)',
                        'rgba(18, 4, 209, 0.7)',
                        'rgba(166, 43, 158, 0.7)']
    let stockSymbols = ['GME','MSFT','DIS','BNTX']

    function getColor(stock){
        if(stock === "GME"){
            return 'rgba(61, 161, 61, 0.7)'
        }
        if(stock === "MSFT"){
            return 'rgba(209, 4, 25, 0.7)'
        }
        if(stock === "DIS"){
            return 'rgba(18, 4, 209, 0.7)'
        }
        if(stock === "BNTX"){
            return 'rgba(166, 43, 158, 0.7)'
        }
    }
    
    console.log("BEGIN")

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    /*
    ** Send STOCK QUERY
    */
    let stockResponse = await fetch("https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=1b3771f2eb9f43248d98e37668af825a")
    let stockResponseObject = await stockResponse.json()
    console.log(stockResponseObject)

    const { GME, MSFT, DIS, BNTX } = stockResponseObject;
    const stocks = [GME, MSFT, DIS, BNTX];
    /*
    ** Define our line chart
    */
    stocks.forEach(stock=>stock.values.reverse())

    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map( stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor:  getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });
    let stockHighs = []

    /*
    ** Thumb through each stock, look at each high-price, and save the highest of them all
    */
    let stockHighIndex=0;
    
    stocks.forEach(stock => {
        stockHighs[stockHighIndex]=0;
        stock.values.forEach(value => {
            nextHigh = parseFloat(value.high)
            if (nextHigh > stockHighs[stockHighIndex]) stockHighs[stockHighIndex]=nextHigh;
        })
        stockHighIndex++;
    })

    console.log("HIGH = " + stockHighs)
    
    /*
    ** Render the high-price bar chart
    */
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: { labels: stockSymbols,
            datasets: [{
                label:"STOCK HIGH PRICES",
                barPercentage: 1.0,
                barThickness: 100,
                maxBarThickness: 80,
                minBarLength: 100,
                data: stockHighs,
                backgroundColor: stockColors,
                borderColor: stockColors
            }]
        }
    });
}

main()