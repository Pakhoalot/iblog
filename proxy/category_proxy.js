const Category = require('../models/category');
const shortid = require('shortid');
const tool = require('../utility/tool');
const redisClient = require('../utility/redisClient');
const logger = require('../utility/logger');

const redis_cache_key = 'categories';
/**
 *获取所有类别
 *
 * @param {*} cb 回调函数,err-first
 */
function getAll(cb){
    //默认先从redis中调取
    redisClient.getItem(redis_cache_key, (err, categories) => {
        if(err) return cb(err);
        if(categories) {
            logging.debug("redis work, category get from cache");
            return cb(null, categories);
        }
        //缓存没有数据,从数据库中调取
        Category.find((err, categories) => {
            if(err) return cb(err);
            //从数据库读取
            if(categories) {
                //存入缓存
                logger.info('find and redis');
                redisClient.setItem(redis_cache_key, categories, redisClient.defaultExpired, err => {
                    if(err) {
                        return cb(err);
                    }
                });
            }
            return cb(null, categories);
        });
    })
}

/**
 *新建一个类别
 *
 * @param {*} param 一个类category对象
 * @param {*} cb
 */
function create(param, cb) {
    //判断category是否非法
    if(!param || typeof param === 'function') {
        logger.error('param category invaild');
        cb(null);
    }
    redisClient.removeItem(redis_cache_key, (err) => {
        if(err) {
            logger.info('insert category fail');
            cb(err);
        }
        //成功删除缓存,插入到数据库
        var category = new Category(param);
        category.save((err, category)=> {
            if(err) cb(err);
            else return cb(null, category);
        })
    });
}
/**
 *根据alias删除类别
 *
 * @param {*} alias
 * @param {*} cb
 */
function deleteByAlias(alias, cb) {
    if(!alias || typeof alias === 'function') {
        logger.error('categoryId invaild');
        cb(null);
    }
    //删除缓存
    redisClient.removeItem(redis_cache_key, (err) => {
        if(err) {
            logger.info('insert category fail');
            cb(err);
        }
        //成功删除缓存,删除数据库副本
        
        Category.deleteOne({Alias: alias}, (err)=> {
            if(err) cb(err);
        });
    });
}

module.exports = {
    getAll: getAll,
    create: create, 
    deleteByAlias: deleteByAlias,
}