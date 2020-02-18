$(document).ready(function(){
    console.log("property.js");
    $.ajax({
        url : "data/properties.json",
        method: 'GET', 
        type: 'json',
        success: function(data) { 
            updateFilters(data);
            showProperties(data);
        },
        error: function(xhr, error, status) {
            console.log(xhr);
        }
    });

    $("#min-price").change(checkValue);
    $("#max-price").change(checkValue);
    $("#min-rooms").change(checkValue);
    $("#max-rooms").change(checkValue);

    $("#btn-filter").click(function(){
        var allFilters = getFilterData();
        console.log(allFilters);

        $.ajax({
            url : "data/properties.json",
            method: 'GET', 
            type: 'json',
            success: function(data) { 
                var filteredData = filterData(data, allFilters);
                console.log(filteredData);
                showProperties(filteredData);
            },
            error: function(xhr, error, status) {
                console.log(xhr);
            }
        });
    })
})

function updateFilters(data){
    var allStatuses = [];
    var allTypes = [];
    var allLocations = [];
    var allPrices = [];
    var allRooms = [];

    for(d of data){
        if(!allStatuses.includes(d.status)){
            allStatuses.push(d.status);
        }
        if(!allTypes.includes(d.type)){
            allTypes.push(d.type);
        }
        if(!allLocations.includes(d.location)){
            allLocations.push(d.location);
        }
        if(!allPrices.includes(d.price)){
            var str = d.price;
            var removeDot = str.replace(".", "");
            var number = Number(removeDot);
            allPrices.push(number);
        }
        if(!allRooms.includes(d.rooms)){
            var num = Number(d.rooms);
            allRooms.push(num);
        }
    }

    var maxPrice = Math.max.apply(Math, allPrices); 
    var maxRooms = Math.max.apply(Math, allRooms); 
    $("#max-price").attr("value", maxPrice);
    $("#max-rooms").attr("value", maxRooms);
    
    makeSelectTag(allStatuses, "Status");
    makeSelectTag(allTypes, "Type");
    makeSelectTag(allLocations, "Location");

}

function showProperties(data){
    console.log(data);
    html = "";
    for(d of data){
        html += `
        <div class="col-xl-4 col-lg-6 mt-3">
                <span class="image-block img-hover">
                    <a class="image-zoom" href="images/g1.jpg" data-gal="prettyPhoto[gallery]">
                        <img src="images/${d.img}" class="img-fluid " alt="${d.title}">
                    </a>
                </span>
                <div class="property-info-list">
                    <div class="detail">
                        <h4 class="title">
                            <a href="single.html">${d.title}</a>
                        </h4>
                        <div class="location mt-2 mb-2">
                            <a href="single.html">
                               <i class="fas fa-map-marker-alt"></i> ${d.location},
                            </a>
                        </div>
                        <ul class="facilities-list clearfix">
                            <li class="mt-2 mb-2">
                                <i class="fas fa-bed"></i> ${d.rooms} Bedrooms
                            </li>
                            <li class="mt-2 mb-2">
                                <i class="fas fa-bath"></i> ${d.status}
                            </li>
                            <li class="mt-2 mb-2">
                                <i class="far fa-building"></i> ${d.type}
                            </li>
                            <li class="mt-2 mb-2">
                                <i class="far fa-building"></i> ${d.price}
                            </li>
                        </ul>
                    </div>
                    <div class="footer-properties">
                        <a class="admin" href="#">
                            <i class="fa fa-user"></i> ${d.owner}
                        </a>
                        <span>
                            <i class="fa fa-calendar-o"></i> ${d.date}
                        </span>
                    </div>
                </div>
            </div>
        `
    }
    $("#property-card-holder").html(html);
}

function makeSelectTag(data, name){
    html = `<option value='0'>${name}</option>`;
    for(d of data){
        html += `<option value="${d}">${d}</option>`
    }
    var nameToLow = name.toLowerCase();
    $(`[name='${nameToLow}']`).html(html);
}

function checkValue(){
    console.log(this);
    var id = $(this).attr("id");
    var getNames = id.split("-");
    var maxMin = getNames[0];
    var priceRoom = getNames[1];

    var maxValue = $(this).attr("max");
 

    if(maxMin == "max" && priceRoom == "price"){
        var a = document.getElementById("min-price").value;
        var b = document.getElementById("max-price").value;
        console.log("--MAX-PRICE--");
        console.log(a,b);
        console.log("A ->", typeof(a));
        console.log("B ->", typeof(b));

        var a = Number(strA);
        var b = Number(strB);

        if(b < a){
            document.getElementById("max-price").value = a;
        }
        if(b > maxValue){
            document.getElementById("max-price").value = maxValue;
        }
    }
    else if(maxMin == "min" && priceRoom == "price"){
        var strA = document.getElementById("min-price").value;
        var strB = document.getElementById("max-price").value;

        console.log("--MIN-PRICE--");
        console.log(a,b);
        console.log("A ->", typeof(a));
        console.log("B ->", typeof(b));

        var a = Number(strA);
        var b = Number(strB);

        if(a > b){
            console.log(a, "is bigger then", b);
            document.getElementById("min-price").value = b;
        }
        if(a < 0){
            document.getElementById("min-price").value = 0;
        }
    }
    else if(maxMin == "max" && priceRoom == "rooms"){
        var strC = document.getElementById("min-rooms").value;
        var strD = document.getElementById("max-rooms").value;

        var c = Number(strC);
        var d = Number(strD);

        if(d < c){
            document.getElementById("max-rooms").value = c;
        }
        if(d > maxValue){
            document.getElementById("max-rooms").value = maxValue;
        }
    }
    else if(maxMin == "min" && priceRoom == "rooms"){
        var strC = document.getElementById("min-rooms").value;
        var strD = document.getElementById("max-rooms").value;

        var c = Number(strC);
        var d = Number(strD);
        if(c > d){
            document.getElementById("min-rooms").value = d;
        }
        if(c < 0){
            document.getElementById("min-rooms").value = 0;
        }
    }
     
}

function getFilterData(){
    var status = $(`[name='status']`).val();
    var maxPrice = Number($("#max-price").val());
    var minPrice = Number($("#min-price").val());
    var type = $(`[name='type']`).val();
    var location = $(`[name='location']`).val();
    var minRooms = Number($("#min-rooms").val());
    var maxRooms = Number($("#max-rooms").val());
    var orderBy = $(`[name='orderby']`).val();

    var filterData = {
        "status": status,
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "type": type,
        "location": location,
        "minRooms": minRooms,
        "maxRooms": maxRooms,
        "orderby": orderBy
    }

    return filterData;
}

function filterData(data, filters){
    var filteredData = data;
    console.log("PRE status", filteredData);
    
    for(idx in filteredData){
        // filter on status
        if(filters.status != "0"){
            if(filters.status != filteredData[idx].status){
                delete filteredData[idx];
                continue;
            }
                
        }

        // filter on price
        var price = strToNumber(filteredData[idx].price);
        if(price > filters.maxPrice || price < filters.minPrice){
            delete filteredData[idx];
            continue;
        }

        // filter on rooms
        if(Number(filteredData[idx].rooms) > filters.maxRooms || Number(filteredData[idx].rooms) < filters.minRooms){
            delete filteredData[idx];
            continue;
        }

        // filter on type
        if(filters.type != "0"){
            if(filters.type != filteredData[idx].type){
                delete filteredData[idx];
                continue;
            } 
        }

        // filter on location
        if(filters.location != "0"){
            if(filters.location != filteredData[idx].location){
                delete filteredData[idx];
                continue;
            }   
        }
    }
    
    var filtered = filteredData.filter(function (el) {
        return el != null;
    });

    console.log("No null data ----->", filtered)
       
    console.log("POST status", filteredData);
    return filtered;
}

function strToNumber(str){
    var x = str.replace(".", "");
    var y = Number(x);
    return y;
}