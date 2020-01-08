/** The main object of the application
 * @class
 */
var MainObject = function() {
  /** The reference to the "this" object
   * @type {MainObject}
   */
  var This = this;

  /** The root element of the class
   * @type {JQuery}
   */
  This.$root = $("<div>");

  /** The Add/Close button for the new item edit dialog
   * @type {JQuery}
   */
  var _$addButton = $("<button>").text("Add");
  /** The edit object for the new taks add in section
   * @type {EditObject}
   */
  var _Edit = null;
  /** The tasks table object
   * @type {TableObject}
   */
  var _Table = new TableObject();
  /** The pop-up details/edit window
   * @type {PopUpObject}
   */
  var _PopUp = new PopUpObject();
  /** Holds all the date releated functions
   * @type {DateObject}
   */
  var _Dates = new DateObject();

  /** The next quarter button for the taks table
   * @type {JQuery}
   */
  var _$nextButton = $("<button>").text("Next");
  /** The previous quarter button for the taks table
   * @type {JQuery}
   */
  var _$previousButton = $("<button>").text("Previous");

  /** The currently active quarter
   * @type {object}
   */
  var _CurrentQuarter = null;

  /**
   * The object initialization function
   */
  function _init() {
    if (isStorageAvailable("localStorage")) {
      _Edit = new EditObject();
      _Edit.onSave = handleEditSave;

      This.$root
        .append(_$addButton)
        .append(_Edit.$root)
        .append(_Table.$root)
        .append(_$previousButton)
        .append(_$nextButton)
        .append(_PopUp.$root);

      _$addButton.on("click", handleAddButoonClick);
      _$previousButton.on("click", handlePreviousButtonClick);
      _$nextButton.on("click", handleNextButtonClick);

      _CurrentQuarter = _Dates.getQuarter(new Date());
      _Table.make(_CurrentQuarter);
      _Table.onTaskClick = handleTaskClick;
      _PopUp.onTaskSave = handleEditSave;
    } else {
      This.$root.text(
        "Browser must support local storage for the application to work."
      );
    }
  }

  /** The function that handles the task click
   * @param {object} Task The object of the task whom is to be showed
   */
  function handleTaskClick(Task) {
    _PopUp.open(Task);
  }
  /**
   * Handles table's previous button's click
   */ 
  function handlePreviousButtonClick() {
    var date = _CurrentQuarter.startDate;
    date.setMonth(date.getMonth() - 3);
    _CurrentQuarter = _Dates.getQuarter(date);
    _Table.make(_CurrentQuarter);
  }
  /**
   * Handles table's next button's click
   */ 
  function handleNextButtonClick() {
    var date = _CurrentQuarter.startDate;
    date.setMonth(date.getMonth() + 3);
    _CurrentQuarter = _Dates.getQuarter(date);
    _Table.make(_CurrentQuarter);
  }
  /**
   * Handles the case where a task was saved
   */
  function handleEditSave() {
    setAddButtonText();
    _PopUp.close();
    _Table.make(_CurrentQuarter);
  }
  /**
   * Handles the Add/Close button click event for new tasks
   */
  function handleAddButoonClick() {
    _Edit.toggle();
    setAddButtonText();
  }
  /**
   * Sets the Add/Close button text
   */
  function setAddButtonText() {
    if (_Edit.isVisible()) {
      _$addButton.text("Close").addClass("close");
    } else {
      _$addButton.text("Add").removeClass("close");
    }
  }
  /** Checks to see if the type of storage you need is available on the system
   * @param {string} type The type of storage you want to check ex localStorage
   */
  function isStorageAvailable(type) {
    var storage;
    try {
      storage = window[type];
      var x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  _init();
};
