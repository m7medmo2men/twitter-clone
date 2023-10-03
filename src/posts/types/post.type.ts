export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;

  createdAt: Date;
  updatedAt: Date;
};

export type Post = {
  id: number;
  content: string;
  pinned: boolean;
  userId: number;
  parentTweetId?: number;
  replyToId?: number;

  createdAt: Date;
  updatedAt: Date;
};

export type PostInfo = Post & {
  postedBy: User;
  replyedFrom?: PostInfo;
  originalTweet?: PostInfo;
  isRetweeted: boolean;
  isLiked: boolean;
  likedBy: User[];
  retweetedBy: User[];
  _count: {
    likedBy: number;
    retweetedBy: number;
    retweets: number;
    replys: number;
  };
};

export type PostFilterInput = {
  id?: number;
  content?: string;
  pinned?: boolean;
  userId?: number;
  parentTweetId?: number;
  replyToId?: number;
  tweetType?: 'tweet' | 'reply' | 'both';
};

// export type PostDto = Post;
export type PostDto = Omit<PostInfo, 'retweetedBy' | 'likedBy'> & {
  replyedFrom?: Omit<PostInfo, 'retweetedBy' | 'likedBy'> & {
    isLiked: boolean;
    isRetweeted: boolean;
  };
  originalTweet?: Omit<PostInfo, 'retweetedBy' | 'likedBy'> & {
    isLiked: boolean;
    isRetweeted: boolean;
  };
  isRetweeted: boolean;
  isLiked: boolean;
};

// const x: PostDto = {
//   id: 32,
//   content: 'Replyedd Tweet',
//   pinned: false,
//   userId: 1,
//   parentTweetId: null,
//   replyToId: 10,
//   createdAt: new Date('2023-09-18T19:28:27.863Z'),
//   updatedAt: new Date('2023-09-18T19:28:27.863Z'),
//   postedBy: {
//     id: 1,
//     firstName: 'Mohamed',
//     lastName: 'Momen',
//     username: 'm7medmo2men',
//     email: 'm7medmo2men@gmail.com',
//     password: 'momo',
//     profilePicture: '/images/default.png',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   replyedFrom: {
//     id: 10,
//     content: 'Hello Sobhy',
//     pinned: false,
//     userId: 1,
//     parentTweetId: null,
//     replyToId: null,
//     createdAt: new Date('2023-09-18T19:28:27.863Z'),
//     updatedAt: new Date('2023-09-18T19:28:27.863Z'),
//     postedBy: {
//       id: 1,
//       firstName: 'Mohamed',
//       lastName: 'Momen',
//       username: 'm7medmo2men',
//       email: 'm7medmo2men@gmail.com',
//       password: 'momo',
//       profilePicture: '/images/default.png',
//       createdAt: new Date('2023-09-18T19:28:27.863Z'),
//       updatedAt: new Date('2023-09-18T19:28:27.863Z'),
//     },
//     likedBy: [
//       {
//         id: 1,
//         firstName: 'Mohamed',
//         lastName: 'Momen',
//         username: 'm7medmo2men',
//         email: 'm7medmo2men@gmail.com',
//         password: 'momo',
//         profilePicture: '/images/default.png',
//         createdAt: new Date('2023-09-18T19:28:27.863Z'),
//         updatedAt: new Date('2023-09-18T19:28:27.863Z'),
//       },
//     ],
//     retweetedBy: [
//       {
//         id: 1,
//         firstName: 'Mohamed',
//         lastName: 'Momen',
//         username: 'm7medmo2men',
//         email: 'm7medmo2men@gmail.com',
//         password: 'momo',
//         profilePicture: '/images/default.png',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ],
//     _count: {
//       likedBy: 1,
//       retweetedBy: 1,
//       retweets: 1,
//       replys: 1,
//     },
//   },
//   originalTweet: null,
//   likedBy: [
//     {
//       id: 1,
//       firstName: 'Mohamed',
//       lastName: 'Momen',
//       username: 'm7medmo2men',
//       email: 'm7medmo2men@gmail.com',
//       password: 'momo',
//       profilePicture: '/images/default.png',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ],
//   retweetedBy: [
//     {
//       id: 1,
//       firstName: 'Mohamed',
//       lastName: 'Momen',
//       username: 'm7medmo2men',
//       email: 'm7medmo2men@gmail.com',
//       password: 'momo',
//       profilePicture: '/images/default.png',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ],
//   _count: {
//     likedBy: 1,
//     retweetedBy: 1,
//     retweets: 0,
//     replys: 0,
//   },
// };
