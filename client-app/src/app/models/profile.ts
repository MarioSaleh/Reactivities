export interface IProfile{
    displayName: string,
    username: string,
    image: string,
    bio: string,
    following: boolean,
    followersCount: number,
    followingsCount: number,
    photos: IPhoto[]
}

export interface IPhoto{
    id: string,
    url: string,
    isMain: boolean
}

export interface IProfileUpdate{
    displayName: string,
    bio: string
}