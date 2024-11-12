/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9982905982905983, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "activities GET"], "isController": false}, {"data": [1.0, 500, 1500, "activities PUT "], "isController": false}, {"data": [1.0, 500, 1500, "authors PUT"], "isController": false}, {"data": [1.0, 500, 1500, "books GET"], "isController": false}, {"data": [1.0, 500, 1500, "activities DELETE "], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos all GET"], "isController": false}, {"data": [1.0, 500, 1500, "authors all GET"], "isController": false}, {"data": [1.0, 500, 1500, "authors GET"], "isController": false}, {"data": [1.0, 500, 1500, "users all GET"], "isController": false}, {"data": [1.0, 500, 1500, "activities POST"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos GET"], "isController": false}, {"data": [1.0, 500, 1500, "books all GET"], "isController": false}, {"data": [0.9777777777777777, 500, 1500, "activities all GET"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 585, 0, 0.0, 56.717948717948744, 35, 1972, 39.0, 87.0, 125.0, 171.25999999999988, 19.705595041600702, 318.3833556670428, 4.3625405796308145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["activities GET", 45, 0, 0.0, 39.266666666666666, 35, 59, 38.0, 45.8, 53.99999999999996, 59.0, 1.6545942567194911, 0.5675100309776814, 0.32348610370629116], "isController": false}, {"data": ["activities PUT ", 45, 0, 0.0, 40.82222222222221, 35, 90, 38.0, 44.4, 75.69999999999982, 90.0, 1.6591085056962724, 0.5490396181285255, 0.5297409601629613], "isController": false}, {"data": ["authors PUT", 45, 0, 0.0, 37.97777777777776, 35, 49, 38.0, 41.4, 42.0, 49.0, 1.6600878001992105, 0.5125809292802598, 0.48678616224591437], "isController": false}, {"data": ["books GET", 45, 0, 0.0, 43.86666666666666, 37, 82, 41.0, 55.79999999999997, 77.89999999999998, 82.0, 1.6726137377341659, 1.4761687388492417, 0.31884199375557537], "isController": false}, {"data": ["activities DELETE ", 45, 0, 0.0, 38.377777777777766, 35, 50, 38.0, 41.8, 44.699999999999996, 50.0, 1.6591696777523781, 0.341879689458742, 0.3600268578091586], "isController": false}, {"data": ["coverPhotos all GET", 45, 0, 0.0, 40.911111111111126, 35, 78, 39.0, 46.8, 55.89999999999997, 78.0, 1.675416061655311, 33.93208369401318, 0.3255935510443427], "isController": false}, {"data": ["authors all GET", 45, 0, 0.0, 76.02222222222221, 69, 105, 73.0, 84.0, 87.39999999999999, 105.0, 1.6571533787516113, 75.74460418201068, 0.3155712000552384], "isController": false}, {"data": ["authors GET", 45, 0, 0.0, 38.93333333333332, 35, 57, 38.0, 42.4, 48.0, 57.0, 1.6592308543195309, 0.5356852738652704, 0.31953156686700346], "isController": false}, {"data": ["users all GET", 45, 0, 0.0, 38.97777777777778, 35, 53, 38.0, 48.8, 52.699999999999996, 53.0, 1.6759152359316225, 1.2831226025101485, 0.3158707427097687], "isController": false}, {"data": ["activities POST", 45, 0, 0.0, 41.55555555555555, 35, 101, 38.0, 44.199999999999996, 90.29999999999987, 101.0, 1.6558118997681863, 0.5479486905287559, 0.5269276410199801], "isController": false}, {"data": ["coverPhotos GET", 45, 0, 0.0, 38.22222222222223, 35, 46, 38.0, 42.4, 44.39999999999999, 46.0, 1.675852822880977, 0.5839299679725904, 0.3292788944957545], "isController": false}, {"data": ["books all GET", 45, 0, 0.0, 88.24444444444443, 72, 284, 77.0, 108.19999999999996, 227.59999999999937, 284.0, 1.6576417283677753, 227.4445970664346, 0.31242661481931705], "isController": false}, {"data": ["activities all GET", 45, 0, 0.0, 174.1555555555556, 111, 1972, 128.0, 168.8, 185.99999999999994, 1972.0, 1.5444810543657332, 4.6822109568060135, 0.2986398913714992], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 585, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
