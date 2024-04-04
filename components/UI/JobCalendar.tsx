'use client';

import { useState } from "react";
import * as S from "./StyleTodoCalendar";
import { useRouter } from "next/dist/client/components/navigation";

export const JobCalendar = (prop:any) => {
  // useState 훅의 초기값으로 현재 날짜를 넣어줌
  const [today, setToday] = useState(new Date(prop.date)); 
  const [maxDate, setMaxDate] = useState(new Date()); 
  const router = useRouter(); // 캐싱된 데이터만 가져올수 있는듯..

  // onChange 이벤트에 넣어줘서 날짜가 지날 때마다 today값이 업데이트 되도록 구현
  const onChangeToday = (date:any) => {
    setToday(date);
    prop.onHide();
    const godate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    location.replace(`/${prop.comcd}/${godate}`);
    // router.replace(`/${prop.comcd}/${godate}`);
    // router.refresh();
  };
  function formatDate(date:any,dateType: string) {
    // console.log('date:', );
    return date.getDate()
  }
  return (
    <S.CalendarBox>
      <S.StyleCalendar
        calendarType="gregory"
        maxDate={maxDate}
        formatDay= {(loca,date)=>formatDate(date,'d')}
        onChange={onChangeToday}
        value={today}
      />
    </S.CalendarBox>
  );
};

// export default TodoCalendar