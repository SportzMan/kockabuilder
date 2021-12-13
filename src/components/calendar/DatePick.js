import React, { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale, getDefaultLocale } from "react-datepicker";
import hu from "date-fns/locale/hu";
import "react-datepicker/dist/react-datepicker.css";


const DatePick = (date) => {
    registerLocale('hu', hu);
    console.log(date.date);
    //setDefaultLocale('hu');
    console.log(getDefaultLocale());
    const [startDate, setStartDate] = useState(new Date("2021-05-30T22:00:00.000Z"));
    return (
        <DatePicker locale='hu' selected={startDate} onChange={date => setStartDate(date)} />
    );
};

export default DatePick;