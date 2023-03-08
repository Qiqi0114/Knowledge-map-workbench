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
export function getNewTaskListAPI(){
    return request({
        url:'/map_tab/knowledgeMapTable/book/getNewTaskList',
        method:'get',
    })
}