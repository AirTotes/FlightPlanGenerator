"use strict";

const attr_name_stroke = "stroke";

// ref: https://stackoverflow.com/a/901144
// ( https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript )
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

function SetValueFromParamName(name)
{
  const elem = document.getElementById(name);
  const value = params[name];

  const isValidCheckResult =
    value
    && (
      !(elem.pattern)
      || (new RegExp(elem.pattern)).test(value)
    );

  console.debug(
    'Target: ', name,
    '\nValue: ', value,
    '\nisValidCheckResult: ', isValidCheckResult
  );

  if (isValidCheckResult)
    elem.value = value;
}

function isValidSelection(elem, value)
{
  if (elem.nodeName != 'SELECT')
    return false;
  
  return (
    [...(elem.options)]
      .filter(v => !(v.hidden))
      .map(v => v.value)
      .includes(value)
    );
}

function SetValueFromParamNameToSelectElem(name)
{
  const elem = document.getElementById(name);
  const isSelectElem = elem.nodeName == 'SELECT'
  const value = params[name];
  const isValidCheckResult = isValidSelection(elem, value);

  console.debug(
    'Target: ', name,
    '\nisSelectElem: ', isSelectElem,
    '\nValue: ', value,
    '\nisValidCheckResult: ', isValidCheckResult
  );

  if (isSelectElem && isValidCheckResult)
    elem.value = value;
}

function LevelTypeSelected(value, input_elem) {
  switch (value) {
    case "VFR":
      input_elem.hidden = true;
      input_elem.required = false;
      break;

    default:
      input_elem.hidden = false;
      input_elem.required = true;
      break;
  }
}

function CruisingSpeedUnitSelected(value, knot_input, mach_input) {
  switch (value) {
    case "M":
      knot_input.hidden = true;
      knot_input.required = false;

      mach_input.hidden = false;
      mach_input.required = true;
      break;

    case "N":
      knot_input.hidden = false;
      knot_input.required = true;

      mach_input.hidden = true;
      mach_input.required = false;
      break;
  }
}

function TimeMMCarryUp(mm_elem, hh_elem)
{
  if (0 <= mm_elem.value && mm_elem.value < 60)
    return;

  if (hh_elem.value === undefined || hh_elem.value === "")
    hh_elem.value = 0;

  let total_mm = parseInt(hh_elem.value) * 60 + parseInt(mm_elem.value);
  if (total_mm < 0)
    total_mm = 0;
  const new_mm = total_mm % 60;

  hh_elem.value = (total_mm - new_mm) / 60;
  mm_elem.value = new_mm;
}

function PersonsOnBoard_IsTBNChanged(checked, PersonsOnBoard)
{
  console.log(checked, PersonsOnBoard);
  PersonsOnBoard.disabled = checked;
  PersonsOnBoard.required = !checked;
}

function ChangeVisibility(...target)
{
  let new_stroke = "black"
  if (target[0].getAttribute(attr_name_stroke) === new_stroke)
    new_stroke = "none";

  target.forEach(v => v?.setAttribute(attr_name_stroke, new_stroke));
}

let last_dinghis_num = "";
let last_dinghis_capacity = "";
let last_dinghis_colour = "";
function HasDinghiesCheckChanged(hasDinghies, num, cap, hasCover, colour)
{
  const new_has_dinghies = !(hasDinghies.getAttribute(attr_name_stroke) === "none");

  const new_stroke_color = new_has_dinghies ? "none" : "black";
  const new_input_disabled = !new_has_dinghies;
  const new_input_required = !new_input_disabled;
  if (new_has_dinghies)
  {
    num.value = last_dinghis_num;
    cap.value = last_dinghis_capacity;
    colour.value = last_dinghis_colour;
  }
  else
  {
    last_dinghis_num = num.value;
    last_dinghis_capacity = cap.value;
    last_dinghis_colour = colour.value;
  }

  hasDinghies.setAttribute(attr_name_stroke, new_stroke_color);
  hasCover.setAttribute(attr_name_stroke, new_stroke_color);
  num.disabled = new_input_disabled;
  cap.disabled = new_input_disabled;
  colour.disabled = new_input_disabled;

  num.required = new_input_required;
  cap.required = new_input_required;
  colour.required = new_input_required;
}

function onRemarksChanged(value, strikethrough)
{
  strikethrough.setAttribute(attr_name_stroke, value.length > 0 ? "none" : "black");
}
