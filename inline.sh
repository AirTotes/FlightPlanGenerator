#!/bin/sh

cd `dirname $0`

SRC_DIR='src'
DST_DIR='dst'

FILE_NAME='flight_plan_sheet.html'

inline-script-tags $SRC_DIR/$FILE_NAME $DST_DIR/$FILE_NAME

cp $SRC_DIR/*.css $DST_DIR
inline-stylesheets dst/flight_plan_sheet.html .
rm $DST_DIR/*.css

cp $SRC_DIR/*.svg $DST_DIR
inline-images dst/flight_plan_sheet.html .
rm $DST_DIR/*.svg
