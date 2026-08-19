import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    return (
        <div className="overflow-y-auto flex-1 p-4 bg-gray-50">
            <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center justify-center">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="mt-2 font-medium text-gray-800">{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">
                            View profile
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {messages && messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs break-words shadow-sm ${msg.senderId === user?._id
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-black rounded-bl-none'
                                }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Messages