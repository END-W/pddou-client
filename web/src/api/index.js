import ajax from '../common/utils/ajax'


//更新用户信息
export const updateUserInfo = (userId,userName,avatar,password,sex,sign,birthday)=>ajax('/api/updateUserInfo',{userId,userName,avatar,password,sex,sign,birthday},'POST');
//获取电影列表
export const getMovieList = ()=>ajax('/api/getMovieList');
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
