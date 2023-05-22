import request from "../utils/request"

//近一年标记数量折线图 
export function getLineChartAPI(){
    return request({
        url:'/map_tab/knowledgeMapTable/book/getLineChart',
        method:'get',
    })
}
//近一年的任务完成量柱状图
export function getHistogramAPI(){
    return request({
        url:'/map_tab/knowledgeMapTable/book/getHistogram',
        method:'get',
    })
}
//近一年内完成任务与违反成任务量
export function getPieChartAPI(){
    return request({
        url:'/map_tab/knowledgeMapTable/book/getPieChart',
        method:'get',
    })
}
//新列表
export function getNewTaskListAPI(
    param:{
        type:string
    }){
    return request({
        url:'/map_tab/knowledgeMapTable/book/getNewTaskList',
        method:'get',
        params:param
    })
}
//结束任务
export function endTaskAPI(
    param: {
      //词条id
      id:string,
    }) {
    return request({
      url: '/map_tab/knowledgeMapTable/book/taskDown',
      method: 'get',
      params:param
    })
  }     
//任务回退
export function rollbackTaskAPI(
    param: {
      //词条id
      id:string,
    }) {
    return request({
      url: '/map_tab/knowledgeMapTable/book/taskDown',
      method: 'get',
      params:param
    })
  }
  //任务延迟
export function extensionAPI(
    param: {
      //词条id
      id:string,
      //时间
      date:string
    }) {
    return request({
      url: '/map_tab/knowledgeMapTable/book/taskOn',
      method: 'get',
      params:param
    })
  }