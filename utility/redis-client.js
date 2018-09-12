var redis = require('redis');
var config = require('../config/redis-config');
const logger = require('./logger');
var redisEnable = config.enable;
const createOptions = config.create_options;
var client;
/****
 * redis 服务 默认开启
 * 服务器设置
 *   内存 1000000b
 *   缓存策略 allkeys-lru
 */
if (redisEnable) {
  client = redis.createClient(createOptions);
  client.on('error', function (err) {
    logger.error('Redis连接错误: ' + err);
    logger.info('redis disable');
    redisEnable = false;
  });
  client.on('ready', (err) => {
    logger.info("redis enable");
    redisEnable = true;
  })
}

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 * @param callback 回调函数
 */
exports.setItem = function (key, value, expired, callback) {
  if (typeof expired === "function") {
    callback = expired;
    expired = undefined;
  }
  if (!redisEnable) {
    return callback(null);
  }

  client.set(key, JSON.stringify(value), function (err) {
    if (err) {
      return callback(err);
    }
    if (expired) {
      client.expire(key, expired);
    }
    return callback(null);
  });
};

/**
 * 获取缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.getItem = function (key, callback) {
  if (!redisEnable) {
    return callback(null, null);
  }

  client.get(key, function (err, reply) {
    if (err) {
      return callback(err);
    }
    return callback(null, JSON.parse(reply));
  });
};

/**
 * 移除缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.removeItem = function (key, callback) {
  if (!redisEnable) {
    return callback(null);
  }

  client.del(key, function (err) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
};

exports.removeItems = function (iterable, callback) {
  if (redisEnable) {
    let hasErr = false;
    for (let iterator of iterable) {
      client.del(iterator, err => {
        if (err) {
          hasErr = true;
        }
      });
    }
    //完成循环,很明显因为异步调用,这里抛不出异常
    if(hasErr) callback(new Error("redis removeItems error"));
  } else return callback(null);
}
/**
 *根据对象属性和值拼装唯一key
 *
 * @param {*} [prefix] - key前缀
 * @param {*} obj - 待解析对象
 * @returns {string} -  拼装的key，带前缀的形如：prefix_name_Tom_age_20，不带前缀的形如：name_Tom_age_20
 */
exports.generateKey = function (prefix, obj) {
  if (typeof prefix === 'object') {
    obj = prefix;
    prefix = undefined;
  }
  let key = '';
  for (let attr in obj) {
    let value = obj[attr];
    key += attr.toString().toLowerCase() + '_' + value.toString();
  }
  if (prefix) {
    key = prefix + key;
  } else {
    key = key.substr(1);
  }
  return key;
}

/**
 * 获取默认过期时间，单位秒
 */
exports.defaultExpired = parseInt(require('../config/redis-config').CacheExpired);
