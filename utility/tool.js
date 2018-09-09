const fs = require('fs');
module.exports = {
    /**
     *获取完整URL
     *
     * @param {*} req
     * @returns
     */
    getFullUrl(req) {
        return `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    },

   
    /**
     *搜索JSON数组
     *
     * @param {Object} jsonArray - json数组
     * @param {Object} conditions - 查询条件, 形如 {"name": "value"}
     * @returns {Object} - 匹配的json对象
     */
    jsonQuery(jsonArray, conditions) {
        let i = 0,
            len = jsonArray.length,
            json,
            flag;
        for (; i < len ; i++) {
            flag = true;
            json = jsonArray[i];
            for(let condition in conditions) {
                if(json[condition] !== conditions[condition]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                return json;
            }
        }
    },

    /**
     *读取配置文件
     *
     * @param {*} filePath - 文件路径
     * @param {*} key - 要读取的配置项
     * @param {*} callback - 回调函数
     * @returns callback 
     */
    getConfig(filePath, key, callback) {
        if(typeof key === 'function') {
            callback = key;
            key = undefined;
        }

        fs.readFile(filePath, 'utf-8', (err, file) => {
            // 获取失败,打印错误
            if (err) {
                console.log(`读取文件%s出错：${err}`, filePath);
                return callback(err);
            }
            // 读取成功,获取文件内容
            let data = JSON.parse(file);
            if (typeof key === 'string') {
                data = data[key];
            }
            return callback(null, data);
        });
    },


    /**
     *写入配置文件
     *
     * @param {*} filePath -要写入的文件
     * @param {*} setters - 配置项
     */
    setConfig(filePath, setters) {
        if(!setters) return false;
        fs.readFile(filePath, 'utf-8', (err, file) =>{
            // 获取失败,打印错误
            if (err) {
                console.log(`读取文件%s出错：${err}`, filePath);
                return false;
            }
            let data = JSON.parse(file);
            for(let key in setters) {
                data[key] = setters[key];
            }
            const newFile = JSON.stringify(data, null, 2);
            fs.writeFile(filePath, newFile, 'utf8');
        });
    },
};