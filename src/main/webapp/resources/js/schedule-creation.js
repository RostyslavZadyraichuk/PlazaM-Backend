$(document).ready(function () {
    let hallSelectHidden = true;
    let cinemaSelectHidden = true;
    let dateFromHidden = true;
    let dateToHidden = true;
    let languageHidden = true;
    let scheduleCreationHidden = true;
    // let scheduleCreationHidden = false;

    let hallSelectAnimate = false;
    let cinemaSelectAnimate = false;
    let scheduleCreationAnimate = false;
    let dateFromAnimate = false;
    let dateToAnimate = false;
    let languageAnimate = false;

    let nextClickedElement = $();
    let calendarDateClick = false;
    let months = monthsCalendarList;
    // let stringDate = "";
    let currentScrollPosition;
    let priceLoop = false;
    let loop;
    let speed = 200;
    let currentDate = new Date();
    let stringDate = "" + (currentDate.getDate() / 10 >= 1 ? currentDate.getDate() : "0" + currentDate.getDate());
    stringDate += "." + ((currentDate.getMonth() + 1) / 10 >= 1 ? currentDate.getMonth() + 1 : "0" + (currentDate.getMonth() + 1));
    stringDate += "." + (currentDate.getFullYear());

    {
        generateCinemas();
        generateHalls();
        $("#price").inputmask({
            alias: "numeric",
            "digits": 2,
            "digitsOptional": false,
            "rightAlign": false,
            "allowMinus": false
        });
        if (typeof selectedDays === 'undefined') {
            $("#date-from .value, #date-to .value").text(stringDate);
            $("#price").get(0).inputmask.setValue("0.00");
        } else {
            selectDays();
            $("#price").get(0).inputmask;
            stringDate = (dateFromDate < 10 ? '0' + dateFromDate : dateFromDate) + '.' + (dateFromMonth < 10 ? '0' + dateFromMonth : dateFromMonth) + '.' + dateFromYear;
            $("#date-from .value").text(stringDate);
            stringDate = (dateToDate < 10 ? '0' + dateToDate : dateToDate) + '.' + (dateToMonth < 10 ? '0' + dateToMonth : dateToMonth) + '.' + dateToYear;
            $("#date-to .value").text(stringDate);
            $("#timepicker").val((seanceTimeHour < 10 ? '0' + seanceTimeHour : seanceTimeHour) + ':' + (seanceTimeMinute < 10 ? '0' + seanceTimeMinute : seanceTimeMinute));
        }
    }

    $("#schedule-creation .scroll").each(function (index) {
        new SimpleBar($("#schedule-creation .scroll")[index], {
            autoHide: false
        });
    })

    $(document).on("click", "#date-from .calendar td", function () {
        if (!dateFromHidden) {
            calendarDateClick = true;
            let newDate = new Date();
            newDate.setFullYear(parseInt($("#date-from .calendar .header-label").text().trim().slice(-4)));
            newDate.setMonth(parseInt(months.indexOf($("#date-from .calendar .header-label").text().trim().slice(0, -5))));
            newDate.setDate(parseInt($(this).text().trim()));

            stringDate = "" + (newDate.getDate() / 10 >= 1 ? newDate.getDate() : "0" + newDate.getDate());
            stringDate += "." + ((newDate.getMonth() + 1) / 10 >= 1 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1));
            stringDate += "." + (newDate.getFullYear());

            $("#date-from .value").text(stringDate);
            $("#date-from .title").click();
        }
    })

    $(document).on("click", "#date-to .calendar td", function () {
        if (!dateToHidden) {
            calendarDateClick = true;
            let newDate = new Date();
            newDate.setFullYear(parseInt($("#date-to .calendar .header-label").text().trim().slice(-4)));
            newDate.setMonth(parseInt(months.indexOf($("#date-to .calendar .header-label").text().trim().slice(0, -5))));
            newDate.setDate(parseInt($(this).text().trim()));

            stringDate = "" + (newDate.getDate() / 10 >= 1 ? newDate.getDate() : "0" + newDate.getDate());
            stringDate += "." + ((newDate.getMonth() + 1) / 10 >= 1 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1));
            stringDate += "." + (newDate.getFullYear());

            $("#date-to .value").text(stringDate);
            $("#date-to .title").click();
        }
    })

    $("#date-from .title").click(function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if (!dateFromAnimate) {
            dateFromAnimate = true;
            let parent = $($(this).parent()[0]);
            if (dateFromHidden) {
                let selectedDate = new Date();
                $(this).parent().css("z-index", "5");
                selectedDate.setFullYear(parseInt($(parent).find(".value").text().trim().slice(-4)));
                selectedDate.setMonth(parseInt($(parent).find(".value").text().trim().slice(3, 6)) - 1);
                selectedDate.setDate(parseInt($(parent).find(".value").text().trim().slice(0, 2)));

                if ($(parent).find(".content").html() === "") {
                    $(parent).find(".content").each(function () {
                        $(this).calendar(selectedDate);
                    });
                } else {
                    $($(parent).find(".calendar td.selected")[0]).removeClass("selected");
                    $(parent).find(".calendar td").each(function () {
                        if (parseInt($(this).text().trim()) === selectedDate.getDate()) {
                            $(this).addClass("selected");
                        }
                    })
                }

                $(parent).find(".triangle").addClass("triangle-0");
                // $(this).css("background-size", "100% 100%");
                $(parent).animate({
                    "width": "284px",
                    "top": "0"
                }, 300, "easeInOutQuint", function () {
                    $(parent).animate({
                        "height": "215px"
                    }, 300, "easeInOutQuint", function () {
                        dateFromAnimate = false;
                        dateFromHidden = false;
                    });
                });
            } else {
                let delay = calendarDateClick ? 200 : 0;
                $(parent).delay(delay).find(".triangle").removeClass("triangle-0");
                $(parent).delay(delay).animate({
                    "height": "25px",
                    "top": "92px"
                }, 300, "easeInOutQuint", function () {
                    $(parent).animate({
                        "width": "100%"
                    }, 300, "easeInOutQuint", function () {
                        $(this).css("z-index", "0");
                        dateFromHidden = true;
                        dateFromAnimate = false;
                        calendarDateClick = false;
                    });
                });
            }
        }
    })

    $("#date-from .content").mouseleave(function () {
        if (!dateFromHidden) {
            $("#date-from .title").click();
        }
    })

    $("#date-to .title").click(function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if (!dateToAnimate) {
            dateToAnimate = true;
            let parent = $($(this).parent()[0]);
            if (dateToHidden) {
                let selectedDate = new Date();
                $(this).parent().css("z-index", "5");
                selectedDate.setFullYear(parseInt($(parent).find(".value").text().trim().slice(-4)));
                selectedDate.setMonth(parseInt($(parent).find(".value").text().trim().slice(3, 6)) - 1);
                selectedDate.setDate(parseInt($(parent).find(".value").text().trim().slice(0, 2)));

                if ($(parent).find(".content").html() === "") {
                    $(parent).find(".content").each(function () {
                        $(this).calendar(selectedDate);
                    });
                } else {
                    $($(parent).find(".calendar td.selected")[0]).removeClass("selected");
                    $(parent).find(".calendar td").each(function () {
                        if (parseInt($(this).text().trim()) === selectedDate.getDate()) {
                            $(this).addClass("selected");
                        }
                    })
                }

                $(parent).find(".triangle").addClass("triangle-0");
                // $(this).css("background-size", "100% 100%");
                $(parent).animate({
                    "width": "284px",
                    "top": "0"
                }, 300, "easeInOutQuint", function () {
                    $(parent).animate({
                        "height": "215px"
                    }, 300, "easeInOutQuint", function () {
                        dateToAnimate = false;
                        dateToHidden = false;
                    });
                });
            } else {
                let delay = calendarDateClick ? 200 : 0;
                $(parent).delay(delay).find(".triangle").removeClass("triangle-0");
                $(parent).delay(delay).animate({
                    "height": "25px",
                    "top": "92px"
                }, 300, "easeInOutQuint", function () {
                    $(parent).animate({
                        "width": "100%"
                    }, 300, "easeInOutQuint", function () {
                        $(this).css("z-index", "0");
                        dateToHidden = true;
                        dateToAnimate = false;
                        calendarDateClick = false;
                    });
                });
            }
        }
    })

    $("#date-to .content").mouseleave(function () {
        if (!dateToHidden) {
            $("#date-to .title").click();
        }
    })

    $(".checkbox").click(function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if ($($(this).parents(".day")[0]).hasClass("checked")) {
            $($(this).parents(".day")[0]).removeClass("checked");
        } else {
            $($(this).parents(".day")[0]).addClass("checked");
        }
    })

    $("#plus").mousedown(function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        $("#price").val(parseFloat($("#price").val()) + 0.01);
        priceLoop = true;
        loopPrice(0.01);

        setTimeout(function () {
            if (priceLoop) {
                speed = 100;
                setTimeout(function () {
                    if (priceLoop) {
                        speed = 10;
                        setTimeout(function () {
                            if (priceLoop) {
                                speed = 1;
                            }
                        }, 2000);
                    }
                }, 2000);
            }
        }, 2000);
    })

    $("#plus").mouseup(function () {
        priceLoop = false;
        speed = 200;
        clearTimeout(loop);
    })

    $("#minus").mousedown(function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if ($("#price").val() != "0.00") {
            $("#price").val(parseFloat($("#price").val()) - 0.01);
            priceLoop = true;
            loopPrice(-0.01);

            setTimeout(function () {
                if (priceLoop) {
                    speed = 100;
                    setTimeout(function () {
                        if (priceLoop) {
                            speed = 10;
                            setTimeout(function () {
                                if (priceLoop) {
                                    speed = 1;
                                }
                            }, 2000);
                        }
                    }, 2000);
                }
            }, 2000);
        }
    })

    $("#minus").mouseup(function () {
        priceLoop = false;
        speed = 200;
        clearTimeout(loop);
    })

    $("#schedule-creation").mouseleave(function () {
        if ((!scheduleCreationAnimate && !scheduleCreationHidden) || (scheduleCreationAnimate && scheduleCreationHidden)) {
            $("#add-schedule").click();
        }
    })

    $(document).on("click", ".hall-select .selected", function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if (!scheduleCreationHidden) {
            if (!hallSelectAnimate) {
                hallSelectAnimate = true;
                if (hallSelectHidden) {
                    currentScrollPosition = window.scrollY;
                    window.addEventListener("scroll", noScroll);
                    $(this).parents(".hall-select").first().find(".list").animate({
                        "background-position-x": "100%",
                        "top": "0"
                    }, 250, "easeInOutQuint", function () {
                        $(this).find(".triangle").addClass("triangle-0");
                        $(this).animate({
                            "height": "100%"
                        }, 250, "easeInOutQuint", function () {
                            hallSelectHidden = false;
                            hallSelectAnimate = false;
                            nextClickedElement.click();
                            nextClickedElement = $();
                        });
                    });
                } else {
                    window.removeEventListener("scroll", noScroll);
                    $(this).find(".triangle").removeClass("triangle-0");
                    $(this).parents(".hall-select").first().find(".list").animate({
                        "height": "25px",
                        "top": "92px"
                    }, 250, "easeInOutQuint", function () {
                        $(this).animate({
                            "background-position-x": "200%"
                        }, 250, "easeInOutQuint", function () {
                            hallSelectHidden = true;
                            hallSelectAnimate = false;
                            nextClickedElement.click();
                            nextClickedElement = $();
                        });
                    })
                }
            } else {
                nextClickedElement = $(this);
            }
        }
    })

    $(".hall-select").mouseleave(function () {
        if (!hallSelectAnimate && !hallSelectHidden) {
            $(this).find(".selected").click();
        }
    })

    $(document).on("click", ".cinema-select .selected", function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if (!scheduleCreationHidden) {
            if (!cinemaSelectAnimate) {
                cinemaSelectAnimate = true;
                if (cinemaSelectHidden) {
                    currentScrollPosition = window.scrollY;
                    window.addEventListener("scroll", noScroll);
                    $(this).parents(".cinema-select").first().find(".list").animate({
                        "background-position-x": "100%",
                        "top": "0"
                    }, 250, "easeInOutQuint", function () {
                        $(this).find(".triangle").addClass("triangle-0");
                        $(this).animate({
                            "height": "100%"
                        }, 250, "easeInOutQuint", function () {
                            cinemaSelectHidden = false;
                            cinemaSelectAnimate = false;
                            nextClickedElement.click();
                            nextClickedElement = $();
                        });
                    });
                } else {
                    window.removeEventListener("scroll", noScroll);
                    $(this).find(".triangle").removeClass("triangle-0");
                    $(this).parents(".cinema-select").first().find(".list").animate({
                        "height": "50px",
                        "top": "79px"
                    }, 250, "easeInOutQuint", function () {
                        $(this).animate({
                            "background-position-x": "200%"
                        }, 250, "easeInOutQuint", function () {
                            cinemaSelectHidden = true;
                            cinemaSelectAnimate = false;
                            nextClickedElement.click();
                            nextClickedElement = $();
                        });
                    })
                }
            } else {
                nextClickedElement = $(this);
            }
        }
    })

    $(".cinema-select").mouseleave(function () {
        if (!cinemaSelectAnimate && !cinemaSelectHidden) {
            $(this).find(".selected").click();
        }
    })

    $(document).on("click", ".language-select .selected", function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
        if (!scheduleCreationHidden) {
            if (!languageAnimate) {
                languageAnimate = true;
                if (languageHidden) {
                    currentScrollPosition = window.scrollY;
                    window.addEventListener("scroll", noScroll);
                    $(this).parents(".language-select").first().find(".list").animate({
                        "background-position-x": "100%",
                        "top": "0"
                    }, 250, "easeInOutQuint", function () {
                        $(this).find(".triangle").addClass("triangle-0");
                        $(this).animate({
                            "height": "100%"
                        }, 250, "easeInOutQuint", function () {
                            languageHidden = false;
                            languageAnimate = false;
                            nextClickedElement.click();
                            nextClickedElement = $();
                        });
                    });
                } else {
                    window.removeEventListener("scroll", noScroll);
                    $(this).find(".triangle").removeClass("triangle-0");
                    $(this).parents(".language-select").first().find(".list").animate({
                        "height": "25px",
                        "top": "92px"
                    }, 250, "easeInOutQuint", function () {
                        $(this).animate({
                            "background-position-x": "200%"
                        }, 250, "easeInOutQuint", function () {
                            languageHidden = true;
                            languageAnimate = false;
                            nextClickedElement.click();
                            nextClickedElement = $();
                        });
                    })
                }
            } else {
                nextClickedElement = $(this);
            }
        }
    })

    $(".language-select").mouseleave(function () {
        if (!languageAnimate && !languageHidden) {
            $(this).find(".selected").click();
        }
    })

    $(document).on("click", ".hall, .cinema, .lang", function () {
        if ($(this).hasClass("cinema")) {
            $(".hall-select .selected > div").first().text($(".hall-select .halls-container > div").first().text());
            if ($(this).attr("identifier") !== "NULL") {
                generateHalls($(this).attr("identifier"));
            } else {
                generateHalls();
            }
        }
        $(this).parents(".list").find(".selected > div").first().text($(this).text());
        $(this).parents(".list").find(".selected > div").first().attr("identifier", $(this).attr("identifier"));
        $(this).parents(".list").find(".selected").click();
    })

    $(".hall-select .simplebar-content-wrapper").scroll(function () {
        $(".hall-select .simplebar-vertical .simplebar-scrollbar").css("transform", "translate3d(0px, " +
            ((Math.abs($(".hall-select .simplebar-content").position().top) * ($(".hall-select .simplebar-vertical").height() -
                $(".hall-select .simplebar-vertical .simplebar-scrollbar").height())) / ($(".hall-select .simplebar-content").height() -
                115)) + "px, 0px)");
    })

    $("#movie-search-result .simplebar-content-wrapper").scroll(function () {
        $("#movie-search-result .simplebar-vertical .simplebar-scrollbar").css("transform", "translate3d(0px, " +
            ((Math.abs($("#movie-search-result .simplebar-content").position().top) * ($("#movie-search-result .simplebar-vertical").height() -
                $("#movie-search-result .simplebar-vertical .simplebar-scrollbar").height())) / ($("#movie-search-result .simplebar-content").height() -
                115)) + "px, 0px)");
    })

    $(".cinema-select .simplebar-content-wrapper").scroll(function () {
        $(".cinema-select .simplebar-vertical .simplebar-scrollbar").css("transform", "translate3d(0px, " +
            ((Math.abs($(".cinema-select .simplebar-content").position().top) * ($(".cinema-select .simplebar-vertical").height() -
                $(".cinema-select .simplebar-vertical .simplebar-scrollbar").height())) / ($(".cinema-select .simplebar-content").height() -
                90)) + "px, 0px)");
    })

    $(document).on("click", "#add-schedule", function () {
        if (!scheduleCreationAnimate) {
            scheduleCreationAnimate = true;

            if (scheduleCreationHidden) {
                $("#schedule-creation").animate({
                    "height": "320px"
                }, 500, "easeInOutQuint", function () {
                    scheduleCreationHidden = false;
                    scheduleCreationAnimate = false;
                    nextClickedElement.click();
                    nextClickedElement = $();
                })
            } else {
                $("#schedule-creation").animate({
                    "height": "0"
                }, 500, "easeInOutQuint", function () {
                    scheduleCreationHidden = true;
                    scheduleCreationAnimate = false;
                    if (!dateFromHidden) {
                        $("#date-from .title").click();
                    }
                    if (!dateToHidden) {
                        $("#date-to .title").click();
                    }
                    if (!cinemaSelectHidden) {
                        $(".cinema-select .selected").click();
                    }
                    if (!hallSelectHidden) {
                        $(".hall-select .selected").click();
                    }
                    nextClickedElement.click();
                    nextClickedElement = $();
                })
            }
        } else {
            nextClickedElement = $(this);
        }
    })

    $("#schedule-creation input").focusin(function () {
        $(this).parents(".input").first().prev().css("color", "#D7D7D7");
    })

    $(".button .create-btn").click(function () {
        let validation = true;
        $("#schedule-creation .title").first().css("color", "");
        let dateFrom = new Date($("#date-from .value").text().slice(-4) + "-" + $("#date-from .value").text().slice(3, 5) +
            "-" + $("#date-from .value").text().slice(0, 3));
        let dateTo = new Date($("#date-to .value").text().slice(-4) + "-" + $("#date-to .value").text().slice(3, 5) +
            "-" + $("#date-to .value").text().slice(0, 3));
        let current = new Date();
        current.setDate(current.getDate() - 1);
        if ($("#timepicker").val() == "") {
            validation = false;
            $("#timepicker").parents(".input").first().prev().css("color", "#AF2341");
        }
        if ($("#price").val() == "0.00") {
            validation = false;
            $("#price").parents(".input").first().prev().css("color", "#AF2341");
        }
        if ($(".hall-select .selected").text().trim() == $(".hall-select .hall").first().text().trim()) {
            validation = false;
            $(".hall-select .selected").parents(".input").first().prev().css("color", "#AF2341");
        }
        if ($(".language-select .selected").text().trim() == $(".language-select .hall").first().text().trim()) {
            validation = false;
            $(".language-select .selected").parents(".input").first().prev().css("color", "#AF2341");
        }
        // if ($(".cinema-select .selected").text().trim() == $(".cinema-select .cinema").first().text().trim()) {
        //     validation = false;
        //     $(".cinema-select .selected").parents(".input").first().prev().css("color", "#AF2341");
        // }
        // if (dateFrom < current) {
        //     validation = false;
        //     $("#date-from").parent().prev().css("color", "#AF2341");
        // }
        if (dateTo < current) {
            validation = false;
            $("#date-to").parent().prev().css("color", "#AF2341");
        }
        if ($(".days-select .day.checked").length == 0) {
            validation = false;
            $(".days-select").find(".title-2").css("color", "#AF2341");
        }
        if (validation && !scheduleCreationHidden && !scheduleCreationAnimate) {
            if (typeof startLoading !== 'undefined') {
                startLoading();
            }
            let seanceId;
            if (typeof $("#schedule-creation").attr("identifier") === 'undefined') {
                seanceId = '';
            } else {
                seanceId = $("#schedule-creation").attr("identifier") === '' ? '' : '&seanceId=' + $("#schedule-creation").attr("identifier");
            }
            let movieId = ($("#movie-search-line")[0].hasAttribute("identifier") ? $("#movie-search-line").attr("identifier") : $("#movie").attr("identifier"));
            let hallId = $(".hall-select .selected > div").first().attr("identifier");
            let languageSelected = $(".language-select .selected > div").first().attr("identifier");
            let dateFrom = $("#date-from .title .value").text();
            let dateTo = $("#date-to .title .value").text();
            let time = $("#timepicker").val();
            let price = $("#price").val();
            let days = '';
            $(".days-select .day.checked").each(function () {
                days += $(this).attr("id") + ',';
            });
            days = days.slice(0, -1);

            $.ajax({
                url: window.location.origin + '/admin/schedule/create?movieId=' + movieId + '&hallId=' + hallId + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo +
                    '&startTime=' + time + '&price=' + price + '&days=' + days + '&lang=' + languageSelected + seanceId,
                method: 'POST'
            }).done(function (status) {
                if (status === 'failed') {
                    $("#schedule-creation .title").first().css("color", "#AF2341");
                } else if (status === 'success') {
                    $("#schedule-creation").attr("identifier", "");
                    $("#schedule-creation .title").first().text(scheduleCreationTitle);
                    $("#schedule-creation .create-btn").text(createValue);
                    $("#schedule-creation .day.checked").removeClass("checked")
                    $("#movie-search-line").removeAttr("identifier").val("");
                    $(".hall-select .halls-container .hall").first().click();
                    $(".language-select .languages-container .lang").first().click();
                    $(".cinema-select .cinema-list .cinema").first().click();
                    $("#timepicker").val("");
                    $("#price").val("");
                    $(".days-select .day.selected").click();
                    $("#add-schedule").click();
                    if ($(".schedule-container").length === 0) {
                        window.location.href = '/movie/' + movieId + '?cinemaId=' + cinemaId;
                    } else {
                        $(".schedule-container").html("");
                        getSchedule();
                    }
                }
                if (typeof stopLoading !== 'undefined') {
                    stopLoading();
                }
                window.removeEventListener("scroll", noScroll);
            })
        }
    })

    $(document).on("click", ".movie-result", function () {
        $("#movie-search-line").val($(this).text());
        $("#movie-search-line").attr("identifier", $(this).attr("identifier"));
    })

    $("#movie-search-line").focusin(function () {
        currentScrollPosition = window.scrollY;
        window.addEventListener("scroll", noScroll);
        $("#movie-search-result").animate({
            "height": "100px"
        }, 300, "easeInOutQuint");
    })

    $("#movie-search-line").focusout(function () {
        window.removeEventListener("scroll", noScroll);
        $("#movie-search-result").animate({
            "height": "0"
        }, 300, "easeInOutQuint");
    })

    $("#movie-search-line").keyup(function () {
        $(this).removeAttr("identifier");
        let movieName = $(this).val();
        let resultList = "";
        if (movieName === "") {
            $("#movie-search-result .simplebar-content").html(resultList);
        } else {
            $.ajax({
                url: window.location.origin + "/movies/result?movieFullName=" + movieName,
                method: "GET"
            }).done(function (movies) {
                resultList += '<div class="scroll">';
                if (typeof isAdmin !== 'undefined') {
                    resultList += '<div class="movie-result"><a href="' + window.location.origin + '/admin/movie/create">' + createValue + '</a></div>';
                }
                for (let movie in movies) {
                    resultList += '<div identifier="' + movies[movie].id + '" class="movie-result">' + movies[movie].fullName + '</div>';
                }
                resultList += '</div>';
                $("#movie-search-result").html(resultList);
                $("#movie-search-result .scroll").each(function (index) {
                    new SimpleBar($("#movie-search-result .scroll")[index], {
                        autoHide: false
                    });
                })
            })
        }
    })

    function noScroll() {
        window.scrollTo(0, currentScrollPosition);
    }

    function loopPrice(value) {
        loop = setTimeout(function () {
            $("#price").val(parseFloat($("#price").val()) + value);
            if (priceLoop) {
                loopPrice(value);
            }
        }, speed);
    }

    function generateCinemas() {
        $.ajax({
            url: window.location.origin + "/cinemas/schedule-creation",
            method: 'GET'
        }).done(function (cinemas) {
            let cinemasList = '<div identifier="NULL" class="cinema">' + notSelectedValue + '</div>';
            for (let cinema in cinemas) {
                cinemasList += '<div class="underline"></div><div identifier="' + cinemas[cinema].id +
                    '" class="cinema">' + cinemas[cinema].city + ' (' + cinemas[cinema].name + ')' + '</div>';
            }
            $("#schedule-creation .cinema-select .cinema-list").html(cinemasList);
        });
    }

    // function generateHalls() {
    //     $.ajax({
    //         url: window.location.origin + "/halls",
    //         method: 'GET'
    //     }).done(function (halls) {
    //         let hallsList = '<div class="cinema">' + $("#schedule-creation .hall-select .hall").first().text() + '</div>';
    //         for (let hall in halls) {
    //             hallsList += '<div class="underline"></div><div identifier="' + hall.id + '" class="hall">' +
    //                 + hall.technology.slice(1) + ' (' + hall.number + ')' + '</div>';
    //         }
    //         $("#schedule-creation .hall-select .halls-container").html(hallsList);
    //     });
    // }

    function generateHalls(cinemaId) {
        let url = window.location.origin + "/halls" + ((typeof cinemaId === 'undefined') ? "" : "?cinemaId=" + cinemaId);
        $.ajax({
            url: url,
            method: 'GET'
        }).done(function (halls) {
            let hallsList = '<div identifier="NULL" class="hall">' + notSelectedValue + '</div>';
            for (let hall in halls) {
                if (halls[hall].technology === '_RM_PLUS') {
                    hallsList += '<div class="underline"></div><div identifier="' + halls[hall].id +
                        '" class="hall">RM+ (' + halls[hall].number + ')' + '</div>';
                } else {
                    hallsList += '<div class="underline"></div><div identifier="' + halls[hall].id +
                        '" class="hall">' + halls[hall].technology.substr(1) + ' (' + halls[hall].number + ')' + '</div>';
                }
            }
            $("#schedule-creation .hall-select .halls-container").html(hallsList);
        });
    }

    function selectDays() {
        if (typeof selectedDays !== 'undefined') {
            for (let day in selectedDays) {
                let id = '#' + selectedDays[day];
                $(id).addClass("checked");
            }
        }
    }
})