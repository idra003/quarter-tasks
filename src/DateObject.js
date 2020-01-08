/** Handles all the date related manipulation
 * @class
 */
var DateObject = function() {
  var This = this;

  /*** Gets the quarter info that the date belongs to
   * @param {Date} date The date in with the quarter is
   * @returns {object} An object with the quarter info
   */
  This.getQuarter = function(date) {
    var ret = {
        year: date.getFullYear(),
        quarter: Math.ceil((date.getMonth() + 1) / 3),
        startDate: null,
        endDate: null,
        startWeek: 0,
        endWeek: 0
      },
      endMonth,
      startMonth,
      yearEndWeek;

    startMonth = (ret.quarter - 1) * 3;
    endMonth = startMonth + 2;

    ret.startDate = new Date(ret.year, startMonth, 1);
    ret.endDate = new Date(ret.year, endMonth + 1, 1);
    ret.endDate.setDate(ret.endDate.getDate() - ret.endDate.getDay() - 1);

    ret.startWeek = This.getWeek(ret.startDate);
    ret.endWeek = This.getWeek(ret.endDate);

    if (ret.startWeek > ret.endWeek) {
      //the special case for 53 week is the 1st of January or 52 week
      ret.startDate.setDate(
        ret.startDate.getDate() + ret.startDate.getDay() + 1
      );
      ret.startWeek = This.getWeek(ret.startDate);
    } else if (ret.quarter == 4) {
      yearEndWeek = This.getWeek(new Date(ret.year, 11, 31));
      if (ret.endWeek < yearEndWeek) {
        ret.endWeek = yearEndWeek;
      }
    }

    return ret;
  };
  /*** Gets the week number of the date
   * @param {Date} date The date whom week number we will seek
   * @returns {number} The week number in question
   */
  This.getWeek = function(date) {
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var dayNum = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - dayNum);
    var yearStart = new Date(d.getUTCFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };
};
