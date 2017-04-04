'use strict';
const axios = require('axios');
const schedule = require('node-schedule');
const cheerio = require('cheerio');
const fs = require('fs');
const ONEPIECE_SCHEDULE = '*/30 * * * 4,5'; // 每周四、周五当天，每隔三十分钟查询一次

schedule.scheduleJob(ONEPIECE_SCHEDULE, () => {
  const ONEPIECE_CONFIG_PATH = './data.txt';
  axios.get('http://www.onepiece.cc/comic/').then(response => {
    if (response.status === 200) {
      const titlePrefix = '海贼王漫画';
      let $ = cheerio.load(response.data);
      const target = $('#chapter11').find('a').last();
      const currPost = target.attr('href');
      const onepieceTitle = `${titlePrefix}${target.text()}`;
      fs.readFile(ONEPIECE_CONFIG_PATH, 'utf-8', (err, lastPost) => {
        if (err) throw err;
        if (currPost !== lastPost) {
          const notification = `${onepieceTitle}更新啦  http://www.onepiece.cc${currPost}`;
          console.log(notification); // 这里可以替换成外部通知形式，如邮件通知、钉钉通知等
          fs.writeFile(ONEPIECE_CONFIG_PATH, currPost, (err, data) => {
            if (err) throw err;
            console.log('更新海贼王最新一集配置成功');
          });
        } else {
          console.log(`${titlePrefix}还没更新...`);
        }
      });
    }
  }).catch(error => {
    console.log('获取海贼王漫画失败');
    console.log(error);
  });
});


