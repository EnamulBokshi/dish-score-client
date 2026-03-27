import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react'

interface UserInfoCellProps {
    name: string;
    email: string;
    profilePhoto?: string;
}

export default function UserInfoCell({ name, email, profilePhoto }: UserInfoCellProps) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
    <div className='flex items-center gap-3'>
        <Avatar className="h-10 w-10">
            <AvatarImage src={profilePhoto} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">   
            <span className="font-medium text-sm">{name}</span>
            <span className="text-muted-foreground text-xs">{email}</span>
        </div>
    </div>
  )
}
