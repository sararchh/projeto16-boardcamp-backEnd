import { format } from 'date-fns';

export default function formattedDate(date) {
  const formattedDate = format(date, 'yyy-MM-dd', {
    timeZone: 'America/Sao_Paulo',
  });
  
  return formattedDate;
}