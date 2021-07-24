export interface Tweet{
    id:string;
    commentsCount:number;
    message:string;
    tag?:string;
    createdOn:Date;
    appUserId:number;
    replies?:Tweet[]
    tweetId:string;
    likeId?:string;
    likesCount:number;
}