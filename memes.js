const request = require('request')
class MemesTWError extends Error {
  constructor(message){
    super(message)
    this.name = "MemesTWError"
  }
}
const get_contest = (contest_id)=>{
  return new Promise((resolve, reject)=>{
    request(`https://memes.tw/wtf/api?contest=${contest_id}`,(error, response, body)=>{
      if (body=='[]'){
        const ContestError = new MemesTWError('Contest not found!')
        ContestError.name = 'ContestError'
        throw ContestError
      }
      const Memes = JSON.parse(body)
      resolve(Memes)
    })
  })
}
const get_meme = (meme_id)=>{
  return new Promise((resolve, reject)=>{
    request(`https://memes.tw/wtf/${meme_id}`,(error, response, body)=>{
      console.log(response.statusCode)
      const Meme = {
        id: parseInt(meme_id),
        src: body.match(/<img src="https:\/\/.*" class="img-fluid">/gm)[0].split('<img src="')[1].split('" class="img-fluid">')[0],
        author: { id: parseInt(body.match(/<a href="\/wtf\/user\/\d{1,999}">.*<\/a>/gm)[0].split('<a href="/wtf/user/')[1].split('">')[0]), name: body.match(/<a href="\/wtf\/user\/\d{1,999}">.*<\/a>/gm)[0].split('">')[1].split('<\/a>')[0] },
        title: body.match(/<title>.*<\/title>/gm)[0].split('<title>')[1].split('<\/title>')[0],
        pageview: parseInt(body.match(/.*瀏覽/gm)[0].split('瀏覽')[0].split(' ')[4].split(',').join('')),
        total_like_count: parseInt(body.match(/<span>.*<\/span><span>個讚<\/span>/gm)[0].split('<span>')[1].split('</span>')[0]),
        hashtag: body.match(/\#.[\u4E00-\u9FFF]/gm).join(' '),
        contest: { id: parseInt(body.match(/投稿：<a href="\/wtf\?contest=.*">.*<\/a>/gm)[0].split('投稿：<a href="/wtf?contest=')[1].split('">')[0]), name: body.match(/投稿：<a href="\/wtf\?contest=.*">.*<\/a>/gm)[0].split('投稿：<a href="/wtf?contest=')[1].split('">')[1].split('</a>')[0] }
      }
      resolve(Meme)
    })
  })
}
module.exports = {
  Memes: {
    get_contest,
    get_meme
  },
  GIFMeme: {
    
  }
}