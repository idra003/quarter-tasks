var TableObject = function() {
  var This = this;

  This.$root = $("<div>");
  This.onTaskClick = null;

  var _$thead = $("<thead>");
  var _$tbody = $("<tbody>");

  var _Tasks = new TasksObject();
  var _Dates = new DateObject();
  var _monthNameArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  function _init() {
    This.$root.addClass("tasks-table-contaier").append(
      $("<table>")
        .addClass("tasks-table")
        .append(_$thead)
        .append(_$tbody)
    );
  }

  This.make = function(Quarter) {
    buildTHead(Quarter);
    buildTBody(Quarter);
  };

  function buildTBody(Quarter) {
    var Data = _Tasks.getQuarterData(Quarter),
      index,
      item;

    _$tbody.empty();

    index = Data.length;
    while (index--) {
      item = Data[index];
      _$tbody.append(buildTaskRow(item, Quarter));
    }
  }
  function buildTaskRow(Task, Quarter) {
    var $ret = $("<tr>"),
      $taskCell = $("<td>"),
      startWeek,
      endWeek,
      colspan,
      week;

    if (Quarter.startDate > Task.startDate && Quarter.endDate < Task.endDate) {
      colspan = Quarter.endWeek - Quarter.startWeek + 1;
      $ret.append($taskCell);
    } else {
      startWeek = Task.startWeek;
      endWeek = Task.endWeek;
      if (Task.startDate < Quarter.startDate) {
        startWeek = Quarter.startWeek;
      }
      if (Task.endDate > Quarter.endDate) {
        endWeek = Quarter.endWeek;
      }

      colspan = endWeek - startWeek + 1;

      //build the row
      for (week = Quarter.startWeek; week <= Quarter.endWeek; week++) {
        if (week < startWeek || week > endWeek) {
          $ret.append($("<td>"));
        } else {
          $ret.append($taskCell);
          //skip the colspan rows
          week += colspan - 1; //remove 1 so the for look iterator would go to the correct week
        }
      }
    }

    $taskCell
      .addClass("task")
      .attr({ colspan: colspan, title: Task.title })
      .on("click", function() {
        if (typeof This.onTaskClick == "function") {
          This.onTaskClick(Task);
        }
      })
      .append(
        $("<span>")
          .addClass("task-name")
          .text(Task.title)
      );

    return $ret;
  }

  function buildTHead(Quarter) {
    var $firstMonthTH = $("<th>"),
      $secondMonthTH = $("<th>"),
      $thirdMonthTH = $("<th>"),
      $tr = $("<tr>"),
      firstMonthIndex,
      secondMonthIndex,
      thirdMonthIndex,
      date,
      weekNumber,
      colspan,
      secondMonthStartWeek,
      thirdMonthStartWeek;

    monthIndex = Quarter.startDate.getMonth();
    firstMonthIndex = monthIndex;
    secondMonthIndex = monthIndex + 1;
    thirdMonthIndex = monthIndex + 2;

    _$thead.empty().append(
      $("<tr>")
        .append($firstMonthTH.text(_monthNameArr[firstMonthIndex]))
        .append($secondMonthTH.text(_monthNameArr[secondMonthIndex]))
        .append($thirdMonthTH.text(_monthNameArr[thirdMonthIndex]))
    );

    //gets the months start weeks
    date = new Date(Quarter.year, secondMonthIndex, 1);
    secondMonthStartWeek = _Dates.getWeek(date);

    date = new Date(Quarter.year, thirdMonthIndex, 1);
    thirdMonthStartWeek = _Dates.getWeek(date);

    //calculates and applies the colspans
    colspan = secondMonthStartWeek - Quarter.startWeek;
    $firstMonthTH.attr({ colspan: colspan });

    colspan = thirdMonthStartWeek - secondMonthStartWeek;
    $secondMonthTH.attr({ colspan: colspan });

    colspan = Quarter.endWeek - thirdMonthStartWeek + 1;
    $thirdMonthTH.attr({ colspan: colspan });

    for (
      weekNumber = Quarter.startWeek;
      weekNumber <= Quarter.endWeek;
      weekNumber++
    ) {
      $tr.append($("<th>").text(weekNumber));
    }

    _$thead.append($tr.addClass("weeks"));
  }

  _init();
};
