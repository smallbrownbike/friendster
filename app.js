#!/usr/bin/env node
const ytdl = require('ytdl-core'),
      ffmpeg = require('fluent-ffmpeg'),
      program = require('commander'),
      request = require('request');

program
  .option('-q, --quality <quality>', 'How shitty do you need your Friends to be? (good, bad, shit, just fucking garbage)')
  .parse(process.argv);

if(program.quality){
  var quality = program.quality === 'good' ? 320 : program.quality === 'bad' ? 128 : program.quality === 'shit' ? 96 : program.quality === 'just fucking garbage' ? 1 : 320
  request('https://www.googleapis.com/youtube/v3/search?q=friends%20scene&maxResults=20&part=snippet&key=' + process.env.YOUKEY, function (err, response, body) {
    if(err){
      console.log(err)
    } else{
      body=JSON.parse(body)
      var randomNumber = Math.floor(Math.random() * (20 - 1) + 1)
      var randomClip = body.items[randomNumber]
      var id = randomClip.id.videoId
      var url = 'https://www.youtube.com/watch?v=' + id
      var stream = ytdl(url)
      ffmpeg(stream)
      .audioBitrate(quality)
      .format('mp3')
      .output('./friendster.mp3')
      .on('end', () => {
        console.log('Your friends are done downloading.')
      })
      .run()
    }
  })
} else {
  console.log('Please tell me how shitty you want your Friends to be.')
}
