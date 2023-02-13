import request from "../utils/request"

//任务书籍展示列表接口
export function getTaskBookListAPI(
  param: {
    //书籍名称
    bookName:string,
    //分页
    pageNum:number,
    pageSize:number,
  }) {
  return request({
    url: '/map_tab/knowledgeMapTable/book/getTaskBookList',
    method: 'get',
    params:param
  })
}

//根据书籍id获取用户需要标注的章节目录
export function getDirectoryListByBookIdAPI(
  param: {
    //书籍id
    id:string,
  }) {
  return request({
    url: '/map_tab/knowledgeMapTable/book/getDirectoryListByBookId',
    method: 'get',
    params:param
  })
}

//根据目录id获取章节数据 可传背景颜色
export function getTaskChapterAPI(
  param: {
    //书籍id
    id:string,
    //背景
    background:string,
  }) {
  return request({
    url: '/map_tab/knowledgeMapTable/book/getTaskChapter',
    method: 'get',
    params:param
  })
}
