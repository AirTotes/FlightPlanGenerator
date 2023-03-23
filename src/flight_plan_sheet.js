"use strict";

import { Regular } from './RobotoMono-Regular'
import { ToPDF } from "./to_pdf";

const attr_name_stroke = "stroke";

// ref: https://gray-code.com/javascript/edit-get-parameter/
//    : https://gray-code.com/javascript/change-url-at-address-bar/
const params = new Proxy(new URL(window.location.href), {
  get: (url, prop) => url.searchParams.get(prop),
  set: (url, prop, value) =>{
    url.searchParams.set(prop, value);
    history.replaceState('', document.title, url.toString());
    return true;
  },
});

function SetValueFromParamName(name, func)
{
  const elem = document.getElementById(name);
  const value = params[name];

  if (func)
    func(elem, value);

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
  {
    if (elem.type === 'checkbox')
      elem.checked = value === 'true';
    else
      elem.value = value;
  }
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

  setStrikethroughVisibility(elem, value == 'true');
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
  SetValueFromParamName('DestinationAerodrome');

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
  SetValueFromParamName('PersonsOnBoard_IsTBN');

  // 航空機用救命無線機
  SetStrikethroughFromParamName('EmergencyRadio_UHF');
  SetStrikethroughFromParamName('EmergencyRadio_VHF');
  SetStrikethroughFromParamName('EmergencyRadio_ELT');

  // 緊急用具
  SetStrikethroughFromParamName('SurvivalEquipment_All');
  SetStrikethroughFromParamName('SurvivalEquipment_Pokar');
  SetStrikethroughFromParamName('SurvivalEquipment_Desert');
  SetStrikethroughFromParamName('SurvivalEquipment_Maritime');
  SetStrikethroughFromParamName('SurvivalEquipment_Jungle');

  // 救命胴衣
  SetStrikethroughFromParamName('Jacket_All');
  SetStrikethroughFromParamName('Jacket_Light');
  SetStrikethroughFromParamName('Jacket_Fluores');
  SetStrikethroughFromParamName('Jacket_UHF');
  SetStrikethroughFromParamName('Jacket_VHF');

  // 救命ボート
  SetStrikethroughFromParamName('Dinghies');
  SetValueFromParamName('Dinghies_Number');
  SetValueFromParamName('Dinghies_Capacity');
  SetStrikethroughFromParamName('Dinghies_Cover');
  SetValueFromParamName('Dinghies_Colour');

  // 航空機の色及びマーキング
  SetValueFromParamName('AircraftColourAndMarkings');

  // 備考
  SetValueFromParamName(
    'Remarks',
    (_, value) => onRemarksChanged(value, document.getElementById('Remarks_Strikethrough'))
  );

  // 機長
  SetValueFromParamName('PilotInCommand');

  // 提出者
  SetValueFromParamName('FilledBy');

  // Additional Requirements
  SetValueFromParamName('AdditionalRequirements');
}

function subscribeOnParentClickEvents(id, func)
{
  const elem = document.getElementById(id);
  elem.parentNode.addEventListener("click", () => func(elem));
}

function subscribeOnChangeEvents(id, func)
{
  const elem = document.getElementById(id);
  elem.addEventListener("change", func);
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

  const CruisingSpeed_Knot = document.getElementById('CruisingSpeed_Knot');
  const CruisingSpeed_Mach = document.getElementById('CruisingSpeed_Mach');
  subscribeOnChangeEvents(
    'CruisingSpeedUnit',
    ev => CruisingSpeedUnitSelected(ev.target.value, CruisingSpeed_Knot, CruisingSpeed_Mach)
  );

  const Level_Num = document.getElementById('Level_Num');
  subscribeOnChangeEvents(
    'Level_Type',
    ev => LevelTypeSelected(ev.target.value, Level_Num)
  );

  const Endurance_HH = document.getElementById('Endurance_HH');
  subscribeOnChangeEvents(
    'Endurance_MM',
    ev => TimeMMCarryUp(ev.target, Endurance_HH)
  );

  const PersonsOnBoard = document.getElementById('PersonsOnBoard');
  subscribeOnChangeEvents(
    'PersonsOnBoard_IsTBN',
    ev => PersonsOnBoard_IsTBNChanged(ev.target.checked, PersonsOnBoard)
  );

  const Remarks_Strikethrough = document.getElementById('Remarks_Strikethrough');
  subscribeOnChangeEvents(
    'Remarks',
    ev => onRemarksChanged(ev.target.value, Remarks_Strikethrough)
  );

  subscribeOnChangeEvents(
    'inputForm',
    ev => {
      const elem = ev.target;

      params[elem.id] = (elem.type === 'checkbox' ? elem.checked : elem.value).toString();
    }
  );

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
  PersonsOnBoard.disabled = checked;
  PersonsOnBoard.required = !checked;
}

function getStrikethroughVisibility(elem)
{
  return elem?.getAttribute(attr_name_stroke) === "black";
}
function setStrikethroughVisibility(elem, isVisible)
{
  if (!elem)
    return false;

  elem.setAttribute(attr_name_stroke, isVisible ? "black" : "none");
  params[elem.id] = isVisible.toString();

  return isVisible;
}

function ChangeVisibility(...target)
{
  const isVisible = !getStrikethroughVisibility(target[0]);

  target.forEach(v => 
    setStrikethroughVisibility(v, isVisible)
  );

  return isVisible;
}

function setDinghiesFormState(hasDinghiesValue, num, cap, colour)
{
  const new_input_disabled = !hasDinghiesValue;
  const new_input_required = !new_input_disabled;

  num.disabled = new_input_disabled;
  cap.disabled = new_input_disabled;
  colour.disabled = new_input_disabled;

  num.required = new_input_required;
  cap.required = new_input_required;
  colour.required = new_input_required;
}

function HasDinghiesCheckChanged(hasDinghies, num, cap, hasCover, colour)
{
  setDinghiesFormState(
    !ChangeVisibility(hasDinghies, hasCover),
    num,
    cap,
    colour,
  );
}

function onRemarksChanged(value, strikethrough)
{
  setStrikethroughVisibility(strikethrough, !(value?.length > 0));
}

function setInitState()
{
  CruisingSpeedUnitSelected(
    document.getElementById('CruisingSpeedUnit').value,
    document.getElementById('CruisingSpeed_Knot'),
    document.getElementById('CruisingSpeed_Mach'),
  );
  LevelTypeSelected(
    document.getElementById('Level_Type').value,
    document.getElementById('Level_Num')
  );
  TimeMMCarryUp(
    document.getElementById('Endurance_MM'),
    document.getElementById('Endurance_HH')
  );
  PersonsOnBoard_IsTBNChanged(
    document.getElementById('PersonsOnBoard_IsTBN').checked,
    document.getElementById('PersonsOnBoard')
  );
  setDinghiesFormState(
    !getStrikethroughVisibility(document.getElementById('Dinghies')),
    document.getElementById('Dinghies_Number'),
    document.getElementById('Dinghies_Capacity'),
    document.getElementById('Dinghies_Colour'),
  )
}

/* 初期処理 */

async function LoadFont()
{
  const font = new FontFace('RobotoMono', Regular)
  await font.load();

  document.fonts.add(font);
}

let isDownloadButtonHidden = false;
function HideDownloadButton(hideButton)
{
  isDownloadButtonHidden ||= (hideButton == true || params['DLBtnHidden'] || params['DLBtnHidden'] == '');
  if (isDownloadButtonHidden)
  {
    const elem = document.getElementById('GenPdfButton');
    if (elem)
      elem.style.visibility = 'hidden';
  }
}

LoadFont();

// DOMツリー構築完了直後に実行
// ref: https://www.nishishi.com/javascript-tips/onload-page.html
document.addEventListener("DOMContentLoaded", HideDownloadButton);
document.addEventListener("DOMContentLoaded", SetValueFromParams);
document.addEventListener("DOMContentLoaded", SubscribeEvents);
document.addEventListener("DOMContentLoaded", setInitState);
// document.addEventListener("DOMContentLoaded", ToPDF);
