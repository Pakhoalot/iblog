const Post = require('../models/post');
const redisClient = require('../utility/redisClient');
const logger = require('../utility/logger');
const POSTLIST_REDIS_PREFIX = 'posts_list'
var postlistKeysManager = new Set();

/**
 *获取首页文章列表
 *
 * @param {*} {
 *     skip = 0,
 *     limit = 10,
 *     sortBy = "CreateTime",
 *     CategoryAlias = "",
 * }
 * @param {*} cb
 */
function getPostList({
  skip = 0,
  limit = 10,
  sortBy = "CreateTime",
  CategoryAlias = "",
}, cb) {
  //判断参数合法性
  if (typeof cb !== 'function' || 
      typeof limit !== 'number' ||
      typeof skip !== 'number') {
    logger.error('param category invaild');
    cb(new TypeError(`${cb} is not a function`));
  }

  //尝试从缓存中提取post
  let tmp = {
      skip: skip,
      limit: limit,
      sortBy: sortBy,
      CategoryAlias: CategoryAlias,
  }
  const cache_key = redisClient.generateKey(POSTLIST_REDIS_PREFIX, tmp);
  
  redisClient.getItem(cache_key, (err, postlist) => {
    if (err) {
      return cb(err);
    }
    //如果postlist中有值或管理器中存在key才从缓存中调取
    if (postlist && postlistKeysManager.has(cache_key)) {
      return cb(null, postlist);
    }
    //缓存失败, 从数据库中提取
    //构建query对象
    let query = {
      IsActive: true,
      IsDraft: false
    }
    if (CategoryAlias) query.CategoryAlias = CategoryAlias;
    //构建投影,为了不提供多余值,例如content
    let post_projection = {
      "_id": 1,
      "Title": 1,
      "Alias": 1,
      "CategoryAlias": 1,
      "Labels": 1,
      "ViewCount": 1,
      "ModifyTime": 1,
      "CreateTime": 1,
    }
    //构建options, 限制取出值 偏移和排序
    let options = {
      limit: limit,
      skip: skip,
      sort: {
        [sortBy]: 'asc'
      }
    }
    Post.find(query, post_projection, options, (err, postlist) => {
      if (err) return cb(err);
      if (postlist) {
        //有值,存入redis
        redisClient.setItem(cache_key, postlist, redisClient.defaultExpired, err => {
          if (err) return cb(err);

          postlistKeysManager.add(cache_key);
        });

      }
      return cb(null, postlist);
    });
  })
}

/**
 *新建一个post
 *
 * @param {*} {
 *   Title,
 *   Summary = '',
 *   Source = '',
 *   Content = '',
 *   ContentType = '',
 *   CategoryAlias = '',
 *   Labels = [],
 *   Url = '',
 *   IsDraft = true,
 *   IsActive = true
 * }
 * @param {*} cb
 * @returns
 */
function create({
  Title,
  Summary = '',
  Source = '',
  Content = '',
  ContentType = '',
  CategoryAlias = '',
  Labels = [],
  Url = '',
  IsDraft = true,
  IsActive = true
}, cb) {
  //判断参数是否合法
  if (!Title ||
    typeof cb !== 'function' ||
    typeof IsDraft !== 'boolean' ||
    typeof IsActive !== 'boolean') {

    logger.error('param invaild');
    return cb(new TypeError('param post invaild'));
  }

  let param = {
    Title: Title,
    Summary: Summary,
    Source: Source,
    Content: Content,
    ContentType: ContentType,
    CategoryAlias: CategoryAlias,
    Labels: Labels,
    Url: Url,
    IsDraft: IsDraft,
    IsActive: IsActive,
  };
  //清除所有列表cache
  for (let cache_key of postlistKeysManager) {
    redisClient.removeItem(cache_key, (err) => {
      if (err) {
        logger.error('post_list cache key remove fail');
        //保留处理,暂时不知道怎么处理,不能return cb(err)
      }
    });
  }
  let post = new Post(param);
  post.save((err, post) => {
    if (err) return cb(err);
    else return cb(null, post);
  });
  //重置postlistKeysManager为空
  postlistKeysManager.clear();

}

/* **********************内部函数************************************************* */




/* **********************export************************************************* */

module.exports = {
  getPostList: getPostList,
  create: create,
}
