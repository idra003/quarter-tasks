/** Builds and displays the tables that holds the tasks
 * @class 
 */
var TableObject = function() {
  /** The reference to the "this" object
   * @type {TableObject}
   */
  var This = this;

  /** The root element of the class
   * @type {JQuery}
   */
  This.$root = $("<div>");
  /** The method that will be called when a task is clicked
   * @type {function}
   */
  This.onTaskClick = null;

  /** The THEAD of the table
   * @type {JQeury}
   */
  var _$thead = $("<thead>");
  /** The TBODY of the table
   * @type {JQuery}
   */
  var _$tbody = $("<tbody>");
  /** Handles the saving and retriving of the task
   * @type {TasksObject}
   */
  var _Tasks = new TasksObject();
  /** Handles the extra functions that are needed for the dates
   * @type {DateObject}
   */
  var _Dates = new DateObject();
  /** An array with all the month names
   * @type {string[]}
   */
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

  /**
   * The object initialization function
   */
  function _init() {
    This.$root.addClass("tasks-table-contaier").append(
      $("<table>")
        .addClass("tasks-table")
        .append(_$thead)
        .append(_$tbody)
    );
  }
  /** Builds the tasks table based off the requested quarter
   * @param {object} Quarter The quarter info of the quarter whom tasks table is needed
   */
  This.make = function(Quarter) {
    buildTHead(Quarter);
    buildTBody(Quarter);
  };  
  /** Builds the body of the table i.e. populates the table with the tasks
   * @param {object} Quarter The quarter info of the quarter whom tasks table is needed
   */
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
  /** Builds a single task row in the table
   * @param {object} Task The task info of the task whom row will be build
   * @param {object} Quarter The quarter info of the quarter whom tasks table is needed
   */
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
      )
      .append($('<div>').addClass('task-details')
        .append($('<b>').text(Task.title).addClass('task-details-title'))
        .append($('<div>').text(formatDate(Task.startDate) + ' - ' + formatDate(Task.endDate)).addClass('task-details-date'))
        .append($('<div>').text(Task.details).addClass('task-details-details'))
      );

    return $ret;
  }
  /** Formats a date object into a dd/MM/yyyy formated string
   * @param {Date} date The date to be formated
   */
  function formatDate(date) {
    var day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear();

    return (
      (day < 10 ? "0" + day : day) +
      "/" +
      (month < 10 ? "0" + month : month) +
      "/" +
      year
    );
  }
  /** Builds the header of the table
   * @param {object} Quarter The quarter info of the quarter whom tasks table is needed
   */
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
