/** Handled the Task's details view and editing
 * @class
 */
var PopUpObject = function() {
  /** The reference to the "this" object
   * @type {PopUpObject}
   */
  var This = this;

  /** The root element of the class
   * @type {JQuery}
   */
  This.$root = $("<div>").addClass("pop-up");
  /** If set to a function serves as the 
   * @type {function?}
   */
  This.onTaskSave = null;

  /** The edit section for the details view
   * @type {EditObject}
   */
  var _Edit = new EditObject();

  /** The Edit button that opens the edit dialog
   * @type {JQuery}
   */
  var _$editButton = $("<button>").text("Edit");
  /** The close button that either brigs you back to the details view or closes the pop-up
   * @type {JQuery}
   */
  var _$closeButton = $("<button>").text("Close");

  /** The title of the task
   * @type {JQuery}
   */
  var _$title = $("<h1>");
  /** The heading that contains the dates of the task i.e. timeframe of the tasks
   * @type {JQuery}
   */
  var _$dates = $("<h2>");
  /** The container for the task details
   * @type {JQuery}
   */
  var _$details = $("<p>");

  /** The container that holds the detailed Task
   * @type {JQuery}
   */
  var _$view = $("<div>");
  /** If TRUE shows that the edit view is open at the moment
   * @type {boolean}
   */
  var _isEditOpen = false;

  /**
   * The object initialization function
   */
  function _init() {
    This.$root
      .on("click", This.close)
      .append(
        $("<div>")
          .addClass("content")
          .on("click", handleBubbling)
          .append(
            $("<div>")

              .addClass("buttons")
              .append(_$editButton.on("click", handleEditClick))
              .append(
                _$closeButton.on("click", handleCloseClick).addClass("close")
              )
          )
          .append(
            _$view
              .append(_$title)
              .append(_$dates)
              .append(_$details)
          )
          .append(_Edit.$root)
      )
      .hide();
  }

  /** Opens up the popup and populates it
   * @param {object} Task Holds the task object to be populated in the pop-up
   */
  This.open = function(Task) {
    _$title.text(Task.title);
    _$dates.text(formatDate(Task.startDate) + " - " + formatDate(Task.endDate));
    _$details.text(Task.details);
    _$view.show();
    _$editButton.show();
    _Edit.setDefaults(
      Task.title,
      Task.details,
      Task.startDate,
      Task.endDate,
      Task.id
    );
    _Edit.onSave = This.onTaskSave;
    _Edit.close();
    This.$root.fadeIn();
  };
  /**
   * Closes the pop-up 
   */
  This.close = function() {
    _isEditOpen = false;
    _Edit.close();
    _$editButton.show();
    _$view.show();
    This.$root.fadeOut();
  };

  /** A helper function to stop the event bubbling
   * @param {*} e The jQuery event object
   */
  function handleBubbling(e) {
    e.preventDefault();
    e.stopPropagation();
    return null;
  }
  /**
   * The function that is called when the close button is clicked i.e. closes the edit and and opens the details view or closes the pop-up
   */
  function handleCloseClick() {
    if (_isEditOpen) {
      _isEditOpen = false;
      _Edit.close();
      _$editButton.show();
      _$view.show();
    } else {
      This.$root.hide();
    }
  }
  /**
   * Handles the edit button on click event
   */
  function handleEditClick() {
    _isEditOpen = true;
    _$editButton.hide();
    _$view.hide();
    _Edit.open();
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

  _init();
};
