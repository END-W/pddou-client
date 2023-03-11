import ajax from '../common/utils/ajax'


//更新用户信息
export const updateUserInfo = (userId,userName,avatar,password,sex,sign,birthday)=>ajax('/api/updateUserInfo',{userId,userName,avatar,password,sex,sign,birthday},'POST');
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
//用户下单
export const order = (userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType)=>ajax('/api/order',{userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType},'POST');
