const Category = require('../models/category');
const redisClient = require('../utility/redis-client');
const logger = require('../utility/logger');

const CATEGORIES_REDIS_KEY = 'categories';
/**
 *获取所有类别
 *
 * @param {*} cb 回调函数,err-first
 */
function getAll(cb){
    //默认先从redis中调取
    redisClient.getItem(CATEGORIES_REDIS_KEY, (err, categories) => {
        if(err) return cb(err);
        if(categories) {
            logger.debug("redis work, category get from cache");
            return cb(null, categories);
        }
        //缓存没有数据,从数据库中调取
        Category.find((err, categories) => {
            if(err) return cb(err);
            //从数据库读取
            if(categories) {
                //存入缓存
                logger.info('find and redis');
                redisClient.setItem(CATEGORIES_REDIS_KEY, categories, redisClient.defaultExpired, err => {
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
 * @param {*} {
 *     CateName,
 *     Alias,
 *     Img = '',
 *     Link = '',
 * }
 * @param {*} cb
 * @returns
 */
function create({
    CategoryName,
    Img = '',
    Link = '',
}, cb) {
    //判断首参是否非法
    if(!CategoryName || typeof cb !== 'function') {
        logger.error('param category invaild');
        return cb(new TypeError('param category invaild'));
    }
    let param = {
        CategoryName: CategoryName,
        Img: Img,
        Link: Link,
    }
    redisClient.removeItem(CATEGORIES_REDIS_KEY, (err) => {
        if(err) {
            logger.error('insert category fail');
            return cb(err);
        }
        //成功删除缓存,插入到数据库
        let category = new Category(param);
        category.save((err, category)=> {
            if(err) return cb(err);
            else return cb(null, category);
        })
    });
}

/**
 *新增一个类别或更新它
 *
 * @param {*} CategoryName
 * @param {*} cb
 * @returns
 */
function updateOrCreate(CategoryName, cb) {
    //判断首参是否非法
    if(!CategoryName || typeof cb !== 'function') {
        logger.error('param category invaild');
        return cb(new TypeError('param category invaild'));
    }
    
    redisClient.removeItem(CATEGORIES_REDIS_KEY, (err) => {
        if(err) {
            logger.error('insert category fail');
            return cb(err);
        }
        //成功删除缓存,插入到数据库
        Category.findOneAndUpdate(
            {CategoryName: CategoryName},
            {ModifyTime: Date.now()},
            {upsert: true},
            (err, category)=> {
            if(err) return cb(err);
            else return cb(null, category);
        })
    });
}

/**
 *根据CategoryName删除类别
 *
 * @param {*} alias
 * @param {*} cb
 */
function deleteByCategoryName(CategoryName, cb) {
    if(!CategoryName || typeof CategoryName === 'function') {
        logger.error('categoryName invaild');
        return cb(new TypeError("params invaild"));
    }
    //删除缓存
    redisClient.removeItem(CATEGORIES_REDIS_KEY, (err) => {
        if(err) {
            logger.info('insert category fail');
            return cb(err);
        }
        //成功删除缓存,删除数据库副本
        
        Category.deleteOne({CategoryName: CategoryName}, (err)=> {
            if(err) return cb(err);
            else return cb(null);
        });
    });
}

module.exports = {
    getAll: getAll,
    create: create, 
    updateOrCreate: updateOrCreate,
    deleteByCategoryName: deleteByCategoryName,
}