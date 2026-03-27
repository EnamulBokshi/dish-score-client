import { Badge } from '@/components/ui/badge';
import { UserStatus } from '@/types/enums';
import React from 'react'
interface StatusBadgeCellProps{
    status: UserStatus;
}
export default function StatusBadgeCell({ status }: StatusBadgeCellProps) {

  return (
    <Badge variant={status === UserStatus.ACTIVE? "default": status === UserStatus.INACTIVE ? "secondary" : "destructive"}
    >
    <span className='text-sm capitalize'>
          {status.toLowerCase()}
    </span>
    </Badge>
  )
}