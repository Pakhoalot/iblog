const Post = require('../models/post');
const redisClient = require('../utility/redis-client');
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
 *     CategoryName = "",
 * }
 * @param {*} cb
 */
function getPostList({
  skip = 0,
  limit = 10,
  sort = "-createTime",
  categoryName = "",
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
    sort: sort,
    categoryName: categoryName,
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
      isDraft: false,
      isActive: true,
    }
    if (categoryName) query.categoryName = categoryName;
    //构建投影,为了不提供多余值,例如content
    let post_projection = {
      "_id": 1,
      "title": 1,
      "summary": 1,
      "content": 1,
      "categoryName": 1,
      "author":1,
      "labels": 1,
      "viewCount": 1,
      "modifyTime": 1,
      "createTime": 1,
    }
    //构建options, 限制取出值 偏移和排序
    let options = {
      limit: limit,
      skip: skip,
      sort: sort
    }
    Post.find(query, post_projection, options, (err, postlist) => {
      if (err) return cb(err);
      if (postlist) {
        //有值,存入redis
        redisClient.setItem(cache_key, postlist, err => {
          if (err) return cb(err);

          postlistKeysManager.add(cache_key);
        });

      }
      return cb(null, postlist);
    });
  })
}

/**
 *根据id获取post
 *
 * @param {*} postId
 * @param {*} cb
 * @returns
 */
function getPost(postId, cb) {
  //判断参数合法性
  if (typeof postId === 'function' || !postId) {
    return cb(new TypeError('param invalid in getPost'));
  }
  //尝试从缓存中获取
  const cache_key = postId;
  redisClient.getItem(cache_key, (err, post) => {
    if (err) return cb(err);
    //如果有值,则取出
    if (post) {
      return cb(null, post);
    } else {
      //从数据库中取出
      Post.findOne({
        _id: postId
      }, (err, post) => {
        if (err) return cb(err);
        if (post) {
          //存入redis中
          redisClient.setItem(cache_key, post, err => {
            if (err) return cb(err);
          })
        }
        return cb(null, post);
      })
    }
  })

}


/**
 *修改一个post
 *
 * @param {*} postId
 * @param {*} update
 * @param {*} cb
 * @returns
 */
function modify(postId, update, cb) {
  //判断参数是否合法
  if (typeof postId === 'function' ||
    typeof update === 'function') {
    logger.error('param invaild');
    return cb(new TypeError('param post invaild'));
  }
  //清除所有列表cache
  redisClient.removeItems(postlistKeysManager, err => {
    if (err) {
      return cb(err);
    }
  });
  //重置postlistKeysManager为空
  postlistKeysManager.clear();
  //清除本post的cache
  const cache_key = postId;
  redisClient.removeItem(cache_key, (err) => {
    if (err) return cb(err);
    //更新到数据库中
    update.modifyTime = Date.now();
    //对标签进行处理
    if(update.labels) update.labels = update.labels.split(' '),
    Post.updateOne({
      _id: postId
    }, update, (err, result) => {
      if (err) return cb(err);
      else return cb(null, result);
    });
  });

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
 *   CategoryName = '',
 *   Labels = [],
 *   Url = '',
 *   IsDraft = true,
 *   IsActive = true
 * }
 * @param {*} cb
 * @returns
 */
function create({
  title,
  summary = '',
  source = '',
  content = '',
  contentType = 'markdown',
  categoryName = '',
  labels = '',
  url = '',
  author = '',
  isDraft = true,
  isActive = true
}, cb) {
  //判断参数是否合法
  if (!title ||
    typeof isDraft !== 'boolean' ||
    typeof isActive !== 'boolean') {

    logger.error('param invaild');
    return cb(new TypeError('param post invaild'));
  }

  let param = {
    title,
    summary,
    source,
    content,
    contentType,
    categoryName,
    labels: labels.split(' '),
    url,
    author,
    isDraft,
    isActive,
  };
  //清除所有列表cache
  redisClient.removeItems(postlistKeysManager, err => {
    if (err) {
      return cb(err);
    }
  });
  //
  //重置postlistKeysManager为空
  postlistKeysManager.clear();

  //插入到数据库中
  let post = new Post(param);
  post.save((err, post) => {
    if (err) return cb(err);
    else return cb(null, post);
  });
}

/**
 *软删除
 *
 * @param {*} post_id
 */
function softDelete(post_id, cb) {
  Post.updateOne({
    _id: post_id
  }, {
    isActive: false,
    modifyTime: Date.now(),
  }, (err, result) => {
    if (err) {
      return cb(err);
    } else {
      //删除列表cache
      redisClient.removeItems(postlistKeysManager, err => {
        if (err) {
          logger.error(err.message);
        }
      })
      postlistKeysManager.clear();
      return cb(null, result);
    }
  });
}

/**
 *对被软删除的文章还原
 *
 * @param {*} post_id
 * @param {*} cb
 */
function undo(post_id, cb) {
  Post.updateOne({
    _id: post_id
  }, {
    isActive: true,
    modifyTime: Date.now(),
  }, (err, result) => {
    if (err) {
      return cb(err);
    } else {
      //删除列表cache
      redisClient.removeItems(postlistKeysManager, err => {
        if (err) {
          logger.error(err.message);
        }
      })
      postlistKeysManager.clear();
      return cb(null, result);
    }
  });
}


/**
 *删除一篇文章
 *
 * @param {*} post_id
 * @param {*} cb
 */
function hardDelete(post_id, cb) {
  Post.deleteOne({
    _id: post_id
  }, (err, result) => {
    if (err) {
      return cb(err);
    } else {
      //删除列表cache
      redisClient.removeItems(postlistKeysManager, err => {
        if (err) {
          logger.error(err.message);
        }
      })
      postlistKeysManager.clear();
      return cb(null, result);
    }
  });
}
/* **********************内部函数************************************************* */




/* **********************export************************************************* */

module.exports = {
  getPostList: getPostList,
  getPost: getPost,
  modify: modify,
  create: create,
  softDelete: softDelete,
  hardDelete: hardDelete,
  undo: undo,
}
