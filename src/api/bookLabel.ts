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

//词条分页查询接口 查询接口
export function getDirectoryListAPI(
  param: {
    //书籍id
    bookId:string,
    //词条名称
    entryName:string,
    //分页
    pageNum:number,
    pageSize:number,
  }) {
  return request({
    url: '/map_tab/knowledgeMapTable/book/getDirectoryList',
    method: 'get',
    params:param
  })
}

//关系列表
export function getRelationshipAPI() {
  return request({
    url: '/map_tab/knowledgeMapTable/book/getRelationship',
    method: 'get',
  })
}

//词条标注接口
export function saveEntryMapperAPI(
  param: {
    //词条名称
    entryName:string,
    //词条解释 
    entryText:string,
    //书籍id
    bookId:string,
    //父id
    parentId:string,
    //关系id
    relationshipId:string,
  }) {
  return request({
    url: '/map_tab/knowledgeMapTable/book/saveEntryMapper',
    method: 'post',
    data:param
  })
}

//单词条图谱可视化接口
export function getKnowledgeNodeAPI(
  param: {
    //词条id
    id:string,
  }) {
  return request({
    url: '/map_tab/knowledgeMapTable/book/getKnowledgeNode',
    method: 'get',
    params:param
  })
}