import { useMemo } from 'react'

type AvatarProps = {
    name: string
}

const Avatar = ({ name }: AvatarProps) => {
    const initials = useMemo(
        () =>
            name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
        [name]
    )

    return (
        <div
            className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        bg-blue-500
        text-xs
        font-semibold
        text-white
      "
        >
            {initials}
        </div>
    )
}

export default Avatar