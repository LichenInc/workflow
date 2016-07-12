module.exports = function(value, skip_suffix) {
  return value ? moment(value).format("dddd D MMMM, h:mm a") : '';
};
