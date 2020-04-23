"use strict";
$(document).ready(function () {
    $.getJSON("data.json", function (data) {
        //TODO an array with only the data[1] that contains the different hotels data
        const hotels = data[1].entries;
        console.log(hotels);
        // on create shows all the hotels
        let result_html = "";
        hotels.forEach(hotel => {
            result_html += showHotel(hotel);
        })
        $("#resultList").empty().html(result_html);
        //TODO search bar
        // array of filtered cities
        const unCities = [];
        hotels.forEach(element => {
            unCities.push(element.city);
        });
        // console.log(unCities);
        const cities = [...new Set(unCities)];
        // datalist of cities' options        
        const datalist = document.querySelector("#results");
        let options = "";
        for (let i = 0; i < cities.length; i++) {
            const option = "<option value='" + cities[i] + "'/>";
            options += option;
        }
        // console.log(options);
        datalist.innerHTML = options;
        // TODO roomtype selection
        // roomtype array from data[0]
        const roomlist = data[0].roomtypes;
        // populating the roomtype select 
        let icon = "";
        roomlist.forEach(room => {
            // appending icons
            if ((room.name).toLowerCase().includes("single")) {
                icon = "👤";
            } else if (room.name.toLowerCase().includes("double")) {
                icon = "👥";
            } else if (room.name.toLowerCase().includes("family")) {
                icon = "👪";
            } else {
                icon = "🛏️";
            }
            let text = icon + "  " + room.name;
            $('#roomselect').append($('<option>', {
                value: room.name,
                class: "text-center text-dark",
                text: text
            }));
        });
        $(".selector").selectmenu("refresh");
        // TODO price range slider
        // setting price value to label MAX
        $("#priceRange").slider({
            range: "min",
            min: 0,
            max: 10000,
            value: 5000,
            step: 100,
            slide: function (event, ui) {
                $("#price").text("Max: " + ui.value + " €");
            }
        });
        // TODO location select
        // populate location select
        let location_html = '<option value="All" class="text-black bg-top fa">All</option>';
        for (let i = 0; i < cities.length; i++) {
            location_html += '<option value="' + cities[i] + '" class="bg-top text-white fa">' + cities[i] + "</option >"
        }
        $(".locationList").empty().html(location_html);
        // TODO sort by select
        // making an array with single references to the amenities
        let pre_am = [];
        hotels.forEach(element => {
            element.filters.forEach(el => {
                pre_am.push(el.name);
            })
        })
        const amenities = [...new Set(pre_am)];
        // populating sorting by
        let sort_by_html = '<option selected value="All">All</option>';
        for (let i = 0; i < amenities.length; i++) {
            sort_by_html += '<option value="' + amenities[i] + '" class="text-black bg-white">' + amenities[i] + "</option >"
        }
        $(".sortBy").empty().html(sort_by_html);
        // TODO getting user's input values
        // getting the roomtype value
        let roomtypeSelected = "";
        $('#roomselect').selectmenu({
            select: function (event, ui) {
                roomtypeSelected = $(this).val();
            }
        });
        // getting location value
        let locationValue = "All";
        $(".locationList").on("click", function () {
            locationValue = $(".locationList").val()
        });
        // getting guest rating value
        let ratingValue = 0;
        $(".prtype").on("click", function () {
            ratingValue = $(".prtype").val();
        });
        // getting rating value
        let guestratingVal = "All";
        $(".rationgList").on("click", function () {
            guestratingVal = $(".rationgList").val();
        });
        // getting sort by value
        let sortbyVal = "All";
        $(".sortBy").on("click", function () {
            sortbyVal = $(".sortBy").val();
        });
        //show choices on console
        $("#btn_submit").on("click", function (event) {
            event.preventDefault();
            // dates
            let checkInDate = $(".checkInCal").datepicker("getDate");
            let checkOutDate = $(".checkOutCal").datepicker("getDate");
            // getting search value
            let searchValue = $("#search").val();
            //getting price value
            let priceValue = $("#priceRange").slider("value");
            // console.log(searchValue);
            // console.log(priceValue);
            // console.log(checkInDate);
            // console.log(checkOutDate);
            // console.log(roomtypeSelected);
            // console.log(ratingValue);
            // console.log(guestratingVal);
            // console.log(locationValue);
            // console.log(sortbyVal);
            const results = $("#resultList");
            const newHotels = filterHotels(hotels, searchValue, priceValue, ratingValue, guestratingVal);
            let result_html = "";
            newHotels.forEach(hotel => {
                result_html += showHotel(hotel);
            })
            // console.log(newHotels);
            // console.log(result_html);
            $("#resultList").empty().html(result_html);
        });
        // the html for every hotel in the results
        function showHotel(hotel) {
            const hotel_html = `<div class="container result_card">
            <div class="row border-secondary border bg-white">
                <img src="${hotel.thumbnail}" alt="hotel name"
                    class="img-thumbnail col-3 m-0 p-1">
                <div
                    class="col-4 border-right mt-2 mb-2 pb-3 d-flex flex-column justify-content-around align-items-stretch align-items-start">
                    <div>
                        <h4 class="text-success font-weight-bolder">${hotel.hotelName}</h4>
                    </div>
                    <div>
                        <span>
                        <i class='${hotel.guestrating > 0 ? "fas fa-star text-warning" : "far fa-star text-warning"}'></i>
                        <i class='${hotel.guestrating > 1 ? "fas fa-star text-warning" : "far fa-star text-warning"}'></i>
                        <i class='${hotel.guestrating > 2 ? "fas fa-star text-warning" : "far fa-star text-warning"}'></i>
                        <i class='${hotel.guestrating > 3 ? "fas fa-star text-warning" : "far fa-star text-warning"}'></i>
                        <i class='${hotel.guestrating > 4 ? "fas fa-star text-warning" : "far fa-star text-warning"}'></i>
                            Hotel
                        </span>
                    </div>
                    <div>
                        ${hotel.city}
                    </div>
                    <div>
                        <span class="badge badge-success">${hotel.ratings.no}</span>
                        ${hotel.ratings.text} (9 views)
                    </div>
                    <div>
                        Excellent location (9.9/10)
                    </div>
                </div>
                <div
                    class="col-2 border-right mt-2 mb-2 d-flex flex-column justify-content-around align-items-stretch align-items-center ">
                    <div class="bg-bestPrice text-center m-0 p-0">
                        <div>
                            Hotel Website
                        </div>
                        <div>
                        ${hotel.price} €
                        </div>
                    </div>
                    <div class="text-center m-0 p-0">
                        <div>
                            Other Website
                        </div>
                        <div>
                            price €
                        </div>
                    </div>
                    <div class="text-center m-0 p-0">
                        <div>
                            Other Website
                        </div>
                        <div>
                            price €
                        </div>
                    </div>
                    <div class="border-top text-center m-0 p-0 font-weight-bolder">
                        <div>
                            More deals from
                        </div>
                        <div>
                            price € <i class="fas fa-chevron-down fa-xs"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3 mt-2 mb-2 d-flex flex-column justify-content-between align-items-center">
                    <div class="m-auto text-center">
                        <div class="text-success">
                            <a class="text-success" target="_blank">Hotel Website </a>
                        </div>
                        <div class="text-success">
                        ${hotel.price} €
                        </div>
                        <div>
                            3 nights for
                            <span class="text-success">${(hotel.price) * 3} €</span>
                        </div>
                    </div>
                    <button class="btn btn-success form-control font-weight-bolder">View Deal
                        <span class="float-right">
                            <i class="fas fa-chevron-right"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>`
            return hotel_html;
        }
        // filters the hotels array with the users inputs
        function filterHotels(hotels, searchValue, priceValue, ratingValue, guestratingVal) {
            let tempHotel = [];
            hotels.forEach(hotel => {
                if (hotel.city === searchValue && hotel.price <= priceValue && hotel.guestrating >= parseFloat(ratingValue)) {
                    let no = hotel.ratings.no;
                    switch (guestratingVal) {
                        case "All":
                            tempHotel.push(hotel);
                            break;
                        case "Okay":
                            if (no > 0 && no <= 2) {
                                tempHotel.push(hotel);
                            }
                            break;
                        case "Fair":
                            if (no > 2 && no <= 6) {
                                tempHotel.push(hotel);
                            }
                            break;
                        case "Good":
                            if (no > 6 && no <= 7) {
                                tempHotel.push(hotel);
                            }
                            break;
                        case "Very Good":
                            if (no > 7 && no <= 8.5) {
                                tempHotel.push(hotel);
                            }
                            break;
                        case "Excellent":
                            if (no > 8.5 && no <= 10) {
                                tempHotel.push(hotel);
                            }
                            break;
                    }
                }
            })
            return tempHotel;
        }
    })
    //-------------------------------------------------------------------------------------------
    // TODO roomtype select
    // initialing the selectmenu plugin to the roomtype select
    $(".selector").selectmenu({
        appendTo: "#roomselect",
        position: { my: "center" }
    });
    // TODO calendars-functions
    //setting default otions for datepicker
    $.datepicker.setDefaults({
        minDate: 0,
        firstDay: 1,
        showOn: "focus",
        gotoCurrent: false,
        showButtonPanel: true,
        dateFormat: "dd/mm/yy"
    });
    // assigning datepicker to input and check out minDate
    $(".checkInCal").datepicker({
        onClose: function (selectedDate) {
            $(".checkOutCal").datepicker("option", "minDate", selectedDate);
            $(".checkOutCal").datepicker();
        }
    });
    $(".checkInCal, .checkOutCal").datepicker();
    //showning calendar on click
    $(".btn-checkInCal").on("click", function () {
        $(".checkInCal").datepicker("show");
    });
    $(".btn-checkOutCal").on("click", function () {
        $(".checkOutCal").datepicker("show");
    });
    //formatting date 
    function getDateFormated(calendar) {
        let day = $(calendar).datepicker("getDate").getDate();
        let month = $(calendar).datepicker("getDate").getMonth() + 1;
        let year = $(calendar).datepicker("getDate").getFullYear();
        let fDate = year + "-" + month + "-" + day;
        return new Date(fDate);
    }
    // -1 day to farmatted date
    function getBeforeDate(calendar) {
        let cDate = getDateFormated(calendar);
        cDate.setDate(cDate.getDate() - 1);
        $(calendar).datepicker("setDate", cDate);
    }
    // +1 day to formatted date
    function getNextDate(calendar) {
        let cDate = getDateFormated(calendar);
        cDate.setDate(cDate.getDate() + 1);
        $(calendar).datepicker("setDate", cDate);
    }
    // giving functionality to left & right arrows
    $(".checkInCalPrev").on("click", function () {
        getBeforeDate(".checkInCal");
    });
    $(".checkInCalNext").on("click", function () {
        getNextDate(".checkInCal");
    });
    $(".checkOutCalPrev").on("click", function () {
        getBeforeDate(".checkOutCal");
    });
    $(".checkOutCalNext").on("click", function () {
        getNextDate(".checkOutCal");
    });
})
