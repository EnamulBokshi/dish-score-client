import { format } from 'date-fns';
import React from 'react'
interface DateCellProps {
  date: string | Date;
  formatString?: string; // Optional format string for date formatting
}
export default function DateCell({ date, formatString }: DateCellProps) {
    if(!date) return <span className='text-sm text-muted-foreground'>-</span>
    const formattedDate = format(new Date(date), formatString || "MMM dd, yyyy");
  return (
    <span className='text-sm text-muted-foreground'>{formattedDate}</span>
  )
}
