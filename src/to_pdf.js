"use strict";

import { jsPDF } from 'jspdf'
import 'svg2pdf.js'
import './RobotoMono-Regular'

export function ToPDF()
{
  const doc = new jsPDF('p', 'pt', 'a4');

  const elem = document.getElementById('sheet_svg');

  doc
    .svg(elem, {
      x: 0,
      y: 0,
      height: 842,
      width: 595,
    })
    .then(() => {
      doc.save('test.pdf');
    });
}
