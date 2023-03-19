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

function SetStrikethroughFromParamName(name)
{
  const elem = document.getElementById(name);
  const value = params[name];

  if (value === null)
    return;

  const new_stroke = (value == 'true' ? 'black' : 'none')
  elem.setAttribute(attr_name_stroke, new_stroke);
}

function SetValueFromParams()
{
  // 航空機識別
  SetValueFromParamName('AircraftIdentification');

  // 飛行方式
  SetValueFromParamNameToSelectElem('FlightRules');

  // 飛行の種類
  SetValueFromParamNameToSelectElem('TypeOfFlight');

  // 飛行機の数
  SetValueFromParamName('Number');

  // 飛行機の型式
  SetValueFromParamName('TypeOfAircraft');

  // 後方乱気流区分
  SetValueFromParamNameToSelectElem('WakeTurbulenceCategory');

  // 使用する無線設備
  SetValueFromParamNameToSelectElem('Equipment1');
  SetValueFromParamName('Equipment2');
  SetValueFromParamNameToSelectElem('Equipment3');

  // 出発飛行場
  SetValueFromParamName('DepartureAerodrome');

  // 移動開始時刻
  SetValueFromParamName('Time');

  // 巡航速度
  SetValueFromParamNameToSelectElem('CruisingSpeedUnit');
  SetValueFromParamName('CruisingSpeed_Knot');
  SetValueFromParamName('CruisingSpeed_Mach');

  // 巡航高度
  SetValueFromParamNameToSelectElem('Level_Type');
  SetValueFromParamName('Level_Num');

  // 経路
  SetValueFromParamName('Route');

  // 目的飛行場
  SetValueFromParamName('DepartureAerodrome');

  // 移動開始時刻
  SetValueFromParamName('TotalEET');

  // 代替飛行場
  SetValueFromParamName('AltnAerodrome');
  SetValueFromParamName('SecondAltnAerodrome');

  // その他の情報
  SetValueFromParamName('OtherInformation');

  // 燃料搭載量
  SetValueFromParamName('Endurance_HH');
  SetValueFromParamName('Endurance_MM');

  // 搭乗する総人数
  SetValueFromParamName('PersonsOnBoard');

  // 航空機用救命無線機
  SetStrikethroughFromParamName('EmergencyRadio_UHF');
  SetStrikethroughFromParamName('EmergencyRadio_VHF');
  SetStrikethroughFromParamName('EmergencyRadio_ELT');

  // 緊急用具
  // TODO: 実装する
  // SetStrikethroughFromParamName('SurvivalEquipment_All');
  // SetStrikethroughFromParamName('SurvivalEquipment_Pokar');
  // SetStrikethroughFromParamName('SurvivalEquipment_Desert');
  // SetStrikethroughFromParamName('SurvivalEquipment_Maritime');
  // SetStrikethroughFromParamName('SurvivalEquipment_Jungle');

  // 救命胴衣
  // TODO: 実装する
  // SetStrikethroughFromParamName('Jacket_All');
  // SetStrikethroughFromParamName('Jacket_Light');
  // SetStrikethroughFromParamName('Jacket_Fluores');
  // SetStrikethroughFromParamName('Jacket_UHF');
  // SetStrikethroughFromParamName('Jacket_VHF');

  // 救命ボート
  // TODO: 実装する

  // 航空機の色及びマーキング
  SetValueFromParamName('AircraftColourAndMarkings');

  // 備考
  // TODO: 実装する

  // 提出者
  SetValueFromParamName('FilledBy');

  // Additional Requirements
  SetValueFromParamName('AdditionalRequirements');
}

function subscribeOnParentClickEvents(id, func)
{
  const elem = document.getElementById(id);
  elem.parentNode.onclick = () => func(elem);
}

function subscribeOnChangeEvents(id, func)
{
  const elem = document.getElementById(id);
  elem.onchange = func;
}

function SubscribeEvents()
{
  subscribeOnParentClickEvents('EmergencyRadio_UHF', ChangeVisibility);
  subscribeOnParentClickEvents('EmergencyRadio_VHF', ChangeVisibility);
  subscribeOnParentClickEvents('EmergencyRadio_ELT', ChangeVisibility);

  subscribeOnParentClickEvents('SurvivalEquipment_All', v =>
    ChangeVisibility(
      v,
      document.getElementById('SurvivalEquipment_Polar'),
      document.getElementById('SurvivalEquipment_Desert'),
      document.getElementById('SurvivalEquipment_Maritime'),
      document.getElementById('SurvivalEquipment_Jungle'),
    )
  );
  subscribeOnParentClickEvents('SurvivalEquipment_Polar', ChangeVisibility);
  subscribeOnParentClickEvents('SurvivalEquipment_Desert', ChangeVisibility);
  subscribeOnParentClickEvents('SurvivalEquipment_Maritime', ChangeVisibility);
  subscribeOnParentClickEvents('SurvivalEquipment_Jungle', ChangeVisibility);

  subscribeOnParentClickEvents('Jacket_All', v =>
    ChangeVisibility(
      v,
      document.getElementById('Jacket_Light'),
      document.getElementById('Jacket_Fluores'),
      document.getElementById('Jacket_UHF'),
      document.getElementById('Jacket_VHF'),
    )
  );
  subscribeOnParentClickEvents('Jacket_Light', ChangeVisibility);
  subscribeOnParentClickEvents('Jacket_Fluores', ChangeVisibility);
  subscribeOnParentClickEvents('Jacket_UHF', ChangeVisibility);
  subscribeOnParentClickEvents('Jacket_VHF', ChangeVisibility);

  subscribeOnParentClickEvents('Dinghies', v =>
    HasDinghiesCheckChanged(
      v,
      document.getElementById('Dinghies_Number'),
      document.getElementById('Dinghies_Capacity'),
      document.getElementById('Dinghies_Cover'),
      document.getElementById('Dinghies_Colour'),
    )
  );
  subscribeOnParentClickEvents('Dinghies_Cover', ChangeVisibility);

  const CruisingSpeedUnit = document.getElementById('CruisingSpeedUnit');
  const CruisingSpeed_Knot = document.getElementById('CruisingSpeed_Knot');
  const CruisingSpeed_Mach = document.getElementById('CruisingSpeed_Mach');
  CruisingSpeedUnit.onchange = ev => CruisingSpeedUnitSelected(ev.target.value, CruisingSpeed_Knot, CruisingSpeed_Mach);

  const Level_Type = document.getElementById('Level_Type');
  const Level_Num = document.getElementById('Level_Num');
  Level_Type.onchange = ev => LevelTypeSelected(ev.target.value, Level_Num);

  const Endurance_HH = document.getElementById('Endurance_HH');
  const Endurance_MM = document.getElementById('Endurance_MM');
  Endurance_MM.onchange = () => TimeMMCarryUp(Endurance_MM, Endurance_HH);

  const PersonsOnBoard = document.getElementById('PersonsOnBoard');
  const PersonsOnBoard_IsTBN = document.getElementById('PersonsOnBoard_IsTBN');
  PersonsOnBoard_IsTBN.onchange = ev => PersonsOnBoard_IsTBNChanged(ev.target.checked, PersonsOnBoard);

  const Remarks = document.getElementById('Remarks');
  const Remarks_Strikethrough = document.getElementById('Remarks_Strikethrough');
  Remarks.onchange = ev => onRemarksChanged(ev.target.value, Remarks_Strikethrough);

  const GenPdfButton = document.getElementById('GenPdfButton');
  GenPdfButton.onclick = ToPDF;
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

/* 初期処理 */

// DOMツリー構築完了直後に実行
// ref: https://www.nishishi.com/javascript-tips/onload-page.html
document.addEventListener("DOMContentLoaded", SetValueFromParams);
document.addEventListener("DOMContentLoaded", SubscribeEvents);
