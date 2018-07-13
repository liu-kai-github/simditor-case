const fs = require("fs");
const express = require('express');
const formidable = require("formidable");
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());

// 用来测试服务器是否启动
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 将 public 目录配置为静态资源服务器
app.use('/public', express.static('public'));

// 浏览器上传的路由
app.post('/upload', (req, res) => {
    // 初始化 formidable
    const form = new formidable.IncomingForm();
    // 格式化上传的文件
    form.parse(req, function (error, fields, files) {
        // 生成 uuid，为上传的图片命名
        const uuid = uuidv1();
        // 图片上传后的临时存放路径
        const oldpath = files.upload_file.path;
        // 指定的存放路径
        const newpath = `public/images/${uuid}.png`;
        // 将上传好的图片从临时路径拖到指定路径
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            // 向浏览器啊返回访问图片的路径
            res.send({
                "success": true, // false,
                "file_path": `/public/images/${uuid}.png`,
                "msg": "success", // optional
                // "msg": "error message", // optional
            });
        });
    });

});

// 浏览器编辑完成后保存
app.post('/save', (req, res) => {
    console.log(req.body);
    res.send({
        "success": true, // false,
        "msg": "save success", // optional
        // "msg": "error message", // optional
    });
});

const server = app.listen(4000, function () {
    // console.log(server, 'server');
    // const host = server.address().address;
    // const port = server.address().port;
    console.log('Example app listening at http://localhost:4000');
});
