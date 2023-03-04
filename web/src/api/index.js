import ajax from '../common/utils/ajax'


//更新用户信息
export const updateUserInfo = (userId,userName,avatar,password,sex,sign,birthday)=>ajax('/api/updateUserInfo',{userId,userName,avatar,password,sex,sign,birthday},'POST');
//获取电影列表
export const getMovieList = ()=>ajax('/api/getMovieList');
//获取电影详情
export const getMovieDetail = (movieId)=>ajax('/api/getMovieDetail',{movieId});
//判断用户是否想看电影
export const isWishMovie = (userId,movieId)=>ajax('/api/isWishMovie',{userId,movieId},'POST');
//想看电影
export const wishMovie = (userId,movieId)=>ajax('/api/wishMovie',{userId,movieId},'POST');
//取消想看电影
export const cancelWishMovie = (userId,movieId)=>ajax('/api/cancelWishMovie',{userId,movieId},'POST');
//获取当前用户评论
export const getUserComment = (userId,movieId)=>ajax('/api/getUserComment',{userId,movieId});
//更新当前用户评论
export const updateUserComment = (userId,movieId,score,commentContent,commentDate)=>ajax('/api/updateUserComment',{userId,movieId,score,commentContent,commentDate},'POST');
//获取所有用户通过审核的评论
export const getAllUserPassComment = (movieId)=>ajax('/api/getAllUserPassComment',{movieId});
//获取当前评论
export const getCommentById = (commentId)=>ajax('/api/getCommentById',{commentId});
//更新当前评论的用户点赞
export const updateUserSupport = (commentId,supportNum,supportUser)=>ajax('/api/updateUserSupport',{commentId,supportNum,supportUser},'POST');
//获取电影列表
export const getCinemaList = ()=>ajax('/api/getCinemaList');
//获取当前影院详情
export const getCurrentCinemaDetail = (cinemaId)=>ajax('/api/getCurrentCinemaDetail',{cinemaId});
//获取当前影院的排片
export const getCurrentCinemaMovieSchedule = (cinemaId)=>ajax('/api/getCurrentCinemaMovieSchedule',{cinemaId});
//获取排片详情
export const getScheduleById = (scheduleId)=>ajax('/api/getScheduleById',{scheduleId});
//更新排片座位信息
export const updateScheduleSeat = (scheduleId,seatInfo)=>ajax('/api/updateScheduleSeat',{scheduleId,seatInfo},'POST');
//获取当前电影的排片
export const getCurrentMovieSchedule = (movieId)=>ajax('/api/getCurrentMovieSchedule',{movieId});
//根据名字模糊匹配电影
export const matchMovieByName = (movieName)=>ajax('/api/matchMovieByName',{movieName});
//根据名字模糊匹配影院
export const matchCinemaByName = (cinemaName)=>ajax('/api/matchCinemaByName',{cinemaName});
//用户下单
export const order = (userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType)=>ajax('/api/order',{userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType},'POST');
