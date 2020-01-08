/** Handles the saving and retriving of the task
 * @class
 */
var TasksObject = function() {
  /** The unique key for the local storage
   * @type {string}
   */
  var STORAGE_KEY = "AllTasks";
  /** The reference to the "this" object
   * @type {EditObject}
   */
  var This = this;
  /** Handles the extra functions that are needed for the dates
   * @type {DateObject}
   */
  var _Dates = new DateObject();

  /** The method that will save a task into the local storage
   * @param {string} title The title of the task to be saved
   * @param {string} startDate The start date of the task to be saved
   * @param {string} endDate The end date of the task to be saved
   * @param {string} details The details of the task to be saved
   * @param {string} [id] The id of the task to be saved (auto generated if missing)
   * @returns {object} The saved task object
   */
  This.save = function(title, startDate, endDate, details, id) {
    var arr = getAll(),
      index = -1,
      item,
      ret;

    if (typeof id != "string") {
      //makes sure there are no items with the same ID in storage
      id = getUUID();
    } else {
      index = arr.length;
      while (index--) {
        item = arr[index];
        if (id == item.id) {
          arr.splice(index, 1);
          break;
        }
      }

      if (index < 0) {
        throw "TasksObject.save()::No Items with the ID found";
      }
    }

    ret = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      details: details,
      startWeek: _Dates.getWeek(startDate),
      endWeek: _Dates.getWeek(endDate),
      startYear: startDate.getFullYear(),
      endYear: endDate.getFullYear(),
      id: id
    };

    if (index < 0) {
      arr.push(ret);
    } else {
      arr.splice(index, 0, ret);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

    return ret;
  };
  /** Gets the tasks in local storage that belong to a specifc quarter
   * @param {object} Quarter The quarter, whom taks are to be returned object gotten from DateObject.getQuarter()
   * @returns {object[]} An array of all the tasks in the local storage that belong to the quarter at hand
   */
  This.getQuarterData = function(Quarter) {
    var startWeek = Quarter.startWeek,
      endWeek = Quarter.endWeek,
      arr = getAll(),
      ret = [],
      index,
      item,
      startDate,
      endDate;

    index = arr.length;
    while (index--) {
      item = arr[index];

      if (
        (Quarter.startDate > item.startDate &&
          Quarter.endDate < item.endDate) ||
        (endWeek >= item.endWeek &&
          startWeek <= item.endWeek &&
          item.endYear == Quarter.year) ||
        (startWeek <= item.startWeek &&
          endWeek >= item.startWeek &&
          item.startYear == Quarter.year)
      ) {
        ret.push(item);
      }
    }

    return ret;
  };
  /** A function to get all the tasks form the local storage
   * @returns {object[]} An array with all the tasks in the local storage
   */
  function getAll() {
    var ret = localStorage.getItem(STORAGE_KEY),
      index,
      item;
    ret = ret ? JSON.parse(ret) : [];

    index = ret.length;
    while (index--) {
      item = ret[index];
      item.startDate = new Date(item.startDate);
      item.endDate = new Date(item.endDate);
    }

    return ret;
  };
  /** A function to build a unique ID for the tasks
   * @returns {string} A unique ID for the task
   */
  function getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};
