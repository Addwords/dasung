import { useState } from "react";
import * as S from "./StyleTodoCalendar";

const TodoCalendar = (prop:any) => {
  // useState 훅의 초기값으로 현재 날짜를 넣어줌
  const [today, setToday] = useState(new Date(prop.date)); 
  const [maxDate, setMaxDate] = useState(new Date()); 

  // onChange 이벤트에 넣어줘서 날짜가 지날 때마다 today값이 업데이트 되도록 구현
  const onChangeToday = (date:any) => {
    setToday(date);
    prop.onHide();
    const godate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    location.replace(`/${prop.comcd}/${godate}`);
  };
  function formatDate(date:any,dateType: string) {
    // console.log('date:', );
    return date.getDate()
  }
  return (
    <S.CalendarBox>
      <S.StyleCalendar
        calendarType="iso8601"
        maxDate={maxDate}
        formatDay= {(loca,date)=>formatDate(date,'d')}
        onChange={onChangeToday}
        value={today}
      />
    </S.CalendarBox>
  );
};

export default TodoCalendar