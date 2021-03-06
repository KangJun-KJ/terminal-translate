const http = require('http');
const chalk = require('chalk');

module.exports = (query, config) => {
  const key = config.iciba.key;

  const data = {
    w: query.join(' '),
    type: 'json',
    key
  }

  let url = 'http://dict-co.iciba.com/api/dictionary.php?';

  for (let item in data) {
    url += `${item}=${data[item]}&`;
  }

  url = encodeURI(url);

  http.get(url, (res) => {
    var resData = "";
    res.on("data",function(data){
      resData += data;
    });
    res.on("end", function() {
      resData = JSON.parse(resData);
      let str = '';
      if ('word_name' in resData) {
        str += `\r\n  ${chalk.green('~')} ${chalk.cyan(resData.word_name)}`;
        let symbols = resData.symbols[0];
        if ('word_symbol' in symbols) {
          if (symbols.word_symbol !== '') {
            str += chalk.magenta(`   中[${symbols.word_symbol}]`);
          }

          if ('parts' in symbols) {
            str += `\r\n`;
            for (let item of symbols.parts[0].means) {
              str += chalk.green(`\r\n   -  ${item.word_mean} `);
            }
            str += `\r\n`;
          }

        } else {
          if (symbols.ph_am !== '') {
            str += chalk.magenta(`   美[${symbols.ph_am}]`);
          }
          if (symbols.ph_en !== '') {
            str += chalk.magenta(`   英[${symbols.ph_en}]`);
          }
          
          if ('parts' in symbols) {
            str += `\r\n`;
            for (let item of symbols.parts) {
              str += chalk.green(`\r\n\r\n   -  ${item.part}  ${item.means.join(';')}`);
            }
            str += `\r\n`;
          }
        }
        
        console.log(str)
      } else {
        console.log('  iciba can\'t translate sentences! \r\n   please use youdao or baidu!');
      }
    });
  })
  .on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });

}