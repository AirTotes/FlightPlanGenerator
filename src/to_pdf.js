"use strict";

import { jsPDF } from 'jspdf'
import 'svg2pdf.js'
import './RobotoMono-Regular'

function setText(elemId, defaultTextLength, maxLen)
{
  const formElem = document.getElementById(elemId);
  if (!formElem)
  {
    console.error(`Form Element (id: ${elemId}) not found. (str: '${str}', defaultTextLength: ${defaultTextLength}, maxLen: ${maxLen})`);
    return;
  }

  let str = '';
  if (formElem?.type == 'time')
    str = formElem.value.toString().replace(':', '');
  else
    str = formElem?.value?.toString() ?? '';

  if (formElem?.type == 'number' && maxLen)
    str = ('00000000' + str).slice(-maxLen);

  if (formElem.disabled != false)
    str = '';

  setTextFromStr('svg_' + elemId, str, defaultTextLength, maxLen);
}

function setTextFromStr(svgElemId, str, defaultTextLength, maxLen)
{
  const elem = document.getElementById(svgElemId);
  if (!elem)
  {
    console.error(`SVG Element (id: ${svgElemId}) not found. (str: '${str}', defaultTextLength: ${defaultTextLength}, maxLen: ${maxLen})`);
    return;
  }

  const strLen = str?.length ?? 0;

  elem.textContent = str;

  if (defaultTextLength !== undefined && maxLen !== undefined)
  {
    elem.setAttribute(
      'textLength',
      strLen
      * (defaultTextLength / maxLen)
      * (strLen < (maxLen / 2) ? 0.8 : 1)
    );
  }
}

function setTextInSvg()
{
  setText('AircraftIdentification', 108, 7);
  setText('FlightRules');
  setText('TypeOfFlight');
  setText('Number', 22, 2);
  setText('TypeOfAircraft', 58, 4);
  setText('WakeTurbulenceCategory');

  // Equipment1_2
  setText('Equipment3');
  setText('DepartureAerodrome', 58, 4);
  setText('Time', 58, 4);

  // CruisingSpeed
  // Level

  // Route

  setText('DestinationAerodrome', 58, 4);
  setText('TotalEET', 58, 4);
  setText('AltnAerodrome', 58, 4);
  setText('SecondAltnAerodrome', 58, 4);

  // OtherInformation

  // setText('Endurance', 58, 4);
  setText('PersonsOnBoard', 42, 3);
  setText('Dinghies_Number', 22, 2);
  setText('Dinghies_Capacity', 42, 3);
  setText('Dinghies_Colour');
  setText('AircraftColourAndMarkings');
  setText('Remarks');
  setText('PilotInCommand');
  setText('FilledBy');

  // AdditionalRequirements
}

export function ToPDF()
{
  const doc = new jsPDF('p', 'pt', 'a4');

  setTextInSvg();

  const elem = document.getElementById('sheet_svg');
  const svgTextGroup = document.getElementById('svgTextGroup');

  svgTextGroup.style.visibility = 'visible';
  doc
    .svg(elem, {
      x: 0,
      y: 0,
      height: 842,
      width: 595,
    })
    .then(() => {
      svgTextGroup.style.visibility = 'hidden';
      doc.save('test.pdf');
    });
}
