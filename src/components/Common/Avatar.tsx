import { useMemo } from 'react'

type AvatarProps = {
    name: string
    color: string
}

const Avatar = ({ name, color }: AvatarProps) => {
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
        text-xs
        font-semibold
        text-white
      "
            style={{ backgroundColor: color }}
        >
            {initials}
        </div>
    )
}

export default Avatar