/** Handles the task editing and saving 
 * @class
 */
var EditObject = function() {
  /** The reference to the "this" object
   * @type {EditObject}
   */
  var This = this;

  /** The root element of the class
   * @type {JQuery}
   */
  This.$root = $("<div>");
  /** If set is the function that will be called when a task is saved
   * @type {function?}
   */
  This.onSave = null;

  /** The save button that will save the task 
   * @type {JQuery}
   */
  var _$saveButton = $("<button>").text("Save");
  /** The input field for the task's title
   * @type {HtmlElement}
   */
  var _titleDOM = document.createElement("input");
  /** The text area field for the task's details
   * @type {HtmlElement}
   */
  var _detailsDOM = document.createElement("textarea");

  /** Handles the saving and retriving of the task
   * @type {TasksObject}
   */
  var _Tasks = new TasksObject();

  /** The selection calendar for the start date
   * @type {WAI_ARIA_CalendarObject}
   */
  var _StartDate = new WAI_ARIA_CalendarObject();
  /** The selection calendar for the end date 
   * @type {WAI_ARIA_CalendarObject}
   */
  var _EndDate = new WAI_ARIA_CalendarObject();
  
  /** The default title of the task with what the edit object will be popupated with on open
   * @type {string}
   */
  var _defaultTitle = "";
  /** The default details of the task with what the edit object will be popupated with on open
   * @type {string}
   */
  var _defaultDetails = "";
  /** The default start date of the task with what the edit object will be popupated with on open
   * @type {Date?}
   */
  var _defaultStartDate = null;
  /** The default end date of the task with what the edit object will be popupated with on open
   * @type {Date?}
   */
  var _defaultEndDate = null;
  /** The ID of the task with what the task will be saved if populated
   * @type {string?}
   */
  var _defaultID = null;

  /**
   * The object initialization function
   */
  function _init() {
    This.$root
      .addClass("edit")
      .append(
        $("<table>")
          .append(
            $("<tr>")
              .append($("<td>").text("Title"))
              .append($("<td>").append($(_titleDOM)))
          )
          .append(
            $("<tr>")
              .append($("<td>").text("Start Date"))
              .append($("<td>").append($(_StartDate.$root)))
          )
          .append(
            $("<tr>")
              .append($("<td>").text("End Date"))
              .append($("<td>").append($(_EndDate.$root)))
          )
          .append(
            $("<tr>").append(
              $("<td>")
                .attr({ colspan: 2 })
                .text("Details")
            )
          )
          .append(
            $("<tr>").append(
              $("<td>")
                .attr({ colspan: 2 })
                .append($(_detailsDOM))
            )
          )
      )
      .append(_$saveButton.on("click", handleSaveButtonClick))
      .hide();
  }

  /** Sets the default values of the edit object
   * @param {string} title The new default title of the edit object
   * @param {string} details The new default details of the edit object
   * @param {Date} startDate The new default start date of the edit object
   * @param {Date} endDate The new default end date of the edit object
   * @param {string?} id The new id of the task being edited
   */
  This.setDefaults = function(title, details, startDate, endDate, id) {
    _defaultTitle = title;
    _defaultDetails = details;
    _defaultStartDate = startDate;
    _defaultEndDate = endDate;
    _defaultID = id;
  };
  /**
   * A method to open up the edid view i.e. make visible
   */
  This.open = function() {
    _titleDOM.value = _defaultTitle;
    _detailsDOM.value = _defaultDetails;
    if (_defaultStartDate == null) {
      _StartDate.clearSelection();
    } else {
      _StartDate.setSelectedDay(_defaultStartDate);
    }
    
    if (_defaultEndDate == null) {
      _EndDate.clearSelection();
    } else {
      _EndDate.setSelectedDay(_defaultEndDate);
    }
    
    This.$root.show();
  };
  /**
   * Closes the edit view i.e. hides it
   */
  This.close = function() {
    This.$root.hide();
  };
  /**
   * Toggels between the open and closed states of the view
   */
  This.toggle = function() {
    This[This.isVisible() ? "close" : "open"]();
  };
  /** Allows to check if the edit object is visible or not
   * @returns {boolean} TRUE if visible FALSE if not
   */
  This.isVisible = function() {
    return This.$root.is(":visible");
  };
  /**
   * The function that handles the save button click and saves the task into the local storage
   */
  function handleSaveButtonClick() {
    var startDate = _StartDate.getSelectedDay(),
      endDate = _EndDate.getSelectedDay();
    if (startDate == null) {
      alert("No Start Date selected");
      return;
    }
    if (endDate == null) {
      alert("No End Date selected");
      return;
    }
    if (startDate > endDate) {
      alert("Start date can't be bigger than the end date.");
      return;
    }
  
    _Tasks.save(
      _titleDOM.value,
      startDate,
      endDate,
      _detailsDOM.value,
      _defaultID
    );
    This.close();
  
    if (typeof This.onSave == "function") {
      This.onSave();
    }
  }
  _init();
};
