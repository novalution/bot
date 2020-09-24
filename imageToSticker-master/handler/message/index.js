require('dotenv').config()
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const {
    Ytdl,
    Igdl,
    Resi,
    Wiki,
    Gtts,
    Toxic,
    About,
    Cuaca,
    Quotes,
    QrMaker,
    Brainly,
    Jsholat,
    Primbon,
    Translate,
    Animhentai
} = require('./../../lib/index')
const {
    menu,
    about,
    quotes,
    toxic,
    getBase64,
    qrMaker,
    readQR,
    ytDlMP3,
    tts,
    generateQuotesDefault,
    generateQuotes,
    jadwalSholat,
    misuh,
    misuhdowo
  } = require('./lib/WALIB')
const { downloader, cekResi, removebg, urlShortener, meme, translate, getLocationData } = require('../../lib')
const { msgFilter, color, processTime, isUrl } = require('../../utils')
const mentionList = require('../../utils/mention')
const { uploadImages } = require('../../utils/fetcher')


const { menuId, menuEn } = require('./text') // Indonesian & English menu

module.exports = msgHandler = async (client = new Client(), message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false

        // Bot Prefix
        const prefix = '#'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'

        // [BETA] Avoid Spam Message
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        //
        if (!isCmd && !isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname)) }
        if (!isCmd && isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'in', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

        // [BETA] Avoid Spam Message
        msgFilter.addFilter(from)

        switch (command) {
        case 'speed':
        case 'ping':
            await client.sendText(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
        case 'tnc':
            await client.sendText(from, 'This bot is an open-source program written in Javascript. \n\nBy using the bot you agreeing to our Terms and Conditions! \nWe do not store any of your data in our servers. We are not responsible for stickers that you create using bots, videos, images or other data that you get from this bot.')
            break
        case 'menu':
        case 'help': {
            const text = `Hi, ${pushname}Hi, ${pushname}! 👋️
            Berikut adalah beberapa fitur yang ada pada bot ini!✨
            Sticker Creator:
            1. *#sticker*
            Untuk merubah gambar menjadi sticker. 
            Penggunaan: kirim gambar dengan caption #sticker atau balas gambar yang sudah dikirim dengan #sticker
            2. *#sticker* _<Url Gambar>_
            Untuk merubah gambar dari url menjadi sticker. 
            Penggunaan: 
            3. *#gifsticker* _<Giphy URL>_ / *#stickergif* _<Giphy URL>_
            Untuk merubah gif menjadi sticker (Giphy Only)
            Penggunaan: Kirim pesan dengan format *gifsticker https://media.giphy.com/media/JUvI2c1ddyzkwK4RlV/giphy.gif*
            4. *#memesticker* _<teks atas>_ | _<teks bawah>_
            Untuk membuat sticker meme dengan teks atas dan bawah
            Penggunaan: kirim gambar dengan caption _*#meme aku atas | kamu bawah*_, atau juga bisa dengan membalas gambar yang sudah ada.
            Downloader:
            1. *#tiktok* _<tiktok url>_
            Untuk mengunduh video dari video tiktok.
            Penggunaan: kirim pesan dengan format *#tiktok https://www.tiktok.com/@itsandani/video/6869248690381425922* 
            2. *#fb* _<post/video url>_
            Untuk mengunduh video dari Facebook.
            Penggunaan: kirim pesan dengan format *#fb https://www.facebook.com/.....*
            3. *#ig* _<instagram post url>_
            Untuk mengunduh photo dan video dari instagram.
            Penggunaan: kirim pesan dengan format *#ig https://www.instagram.com/p/BPOd1vhDMIp/*
            4. *#twt* _<twitter post url>_
            Untuk mengunduh photo dan video dari Twitter.
            Penggunaan: kirim pesan dengan format *#twt https://twitter.com/ntsana_/status/1306108656887324672*
            Lain-lain:
            1. *#translate* _<kode bahasa>_
            Untuk mengartikan pesan menjadi bahasa yang ditentukan.
            Penggunaan: Balas/quote/reply pesan yang ingin kamu translate dengan _*#translate id*_ <- id adalah kode bahasa. kode bahasa dapat dilihat di *https://bit.ly/33FVldE*
            2. *#resi* _<kurir>_ _<nomer resi>_
            Untuk memeriksa status pengiriman barang, daftar kurir: jne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex.
            Penggunaan: kirim pesan dengan format _*#resi jne 1238757632*_
            3. *#meme* _<teks atas>_ | _<teks bawah>_
            Untuk membuat meme dengan teks atas dan bawah
            Penggunaan: kirim gambar dengan caption _*#meme aku atas | kamu bawah*_, atau juga bisa dengan membalas gambar yang sudah ada.
            4. *#ceklokasi*
            Cek lokasi penyebaran covid-19 di daerah sekitarmu (kelurahan).
            Penggunaan: kirimkan lokasimu lalu balas/quote/reply lokasi yang kamu kirim dengan _*#ceklokasi*_
            5. *#tnc*
            Menampilkan Syarat dan Kondisi Bot.`            
            await client.sendText(from, text)
            break
        }
        case 'tts':
            switch (argv[1]) {
                case 'id':
                    tts('id', argv.splice(2).join(' ')).then(data => {
                        client.reply(new MessageMedia('audio/mp3', data, 'tts'))
                    })
                    break;
                case 'en':
                    tts('en', argv.splice(2).join(' ')).then(data => {
                        client.reply(new MessageMedia('audio/mp3', data, 'tts'))
                    })
                    break;
                default:
                    client.sendMessage(from, 'piilih bahasa: \n\n*id* untuk bahasa indonesia \n*en* untuk bahasa inggris')
                    break;
            }
            break;
            case 'js':
                jadwalSholat(text)
                .then(data => {
                    data.map(({isya, subuh, dzuhur, ashar, maghrib, terbit}) => {
                        var x  = subuh.split(':'); y = terbit.split(':')
                        var xy = x[0] - y[0]; yx = x[1] - y[1]
                        let perbandingan = `${xy < 0 ? Math.abs(xy) : xy}jam ${yx< 0 ? Math.abs(yx) : yx}menit`
                        let msg = `Jadwal Sholat untuk ${text} dan Sekitarnya ( *${tanggal}* )\n\nDzuhur : ${dzuhur}\nAshar  : ${ashar}\nMaghrib: ${maghrib}\nIsya       : ${isya}\nSubuh   : ${subuh}\n\nDiperkirakan matahari akan terbit pada pukul ${terbit} dengan jeda dari subuh sekitar ${perbandingan}\n\n\nFetch from: https://api.banghasan.com/`
                        client.reply(message)
                    })
                })
                .catch(err => client.reply(err))
                break;
        //kata kata
        case 'quotesmaker':
          const attachmentData = await message.downloadMedia()

          if (!argv[1] || !argv[2] || !argv[3]) client.reply('argv invalid.')

          if (type == 'image') {
              fs.writeFile(process.cwd() + '/quotesClient.jpg', attachmentData.data, 'base64', (err) => {
                  try {
                      generateQuotes(process.cwd() + '/quotesClient.jpg', argv[1], argv[2], argv.splice(3).join(' '))
                        .then(data => {
                            client.reply(new MessageMedia('image/jpeg', data, 'quotes'))
                        })
                  } catch (err) {
                      client.sendText(from, 'error parse data.')
                  }
              })
          } else {
              generateQuotesDefault(argv[1], argv[2], argv.splice(3).join(' ')).then(data => {
                  client.reply(new MessageMedia('image/jpeg', data, 'quotes'))
              })
          }
          break;
        case 'quotes':{
            quotes().then(quotes => {
              client.sendText(from, quotes)
          
          })
        }
            break;
        case 'toxic':{
            toxic().then(toxic => {
              client.sendText(from, toxic)
          })
      }
            break;
        case 'misuh':
        case 'pisuhi':{
            misuh().then(misuh => {
                client.sendText(from, misuh)
        })
    }
            break;
        case 'misuhdowo':{
            misuhdowo().then(misuhdowo => {
                client.sendText(from, misuhdowo)
        })
    }
            break;
        // Sticker Creator
        case 'sticker':
        case 'stiker':
            if (isMedia) {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type === 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 1) {
                if (!url.match(isUrl)) await client.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id)
                await client.sendStickerfromUrl(from, url)
                    .then((r) => {
                        if (!r && r !== undefined) client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.')
                    })
            } else {
                await client.reply(from, 'Tidak ada gambar! Untuk membuka daftar perintah kirim #menu', id)
            }
            break
        case 'stikergif':
        case 'stickergif':
        case 'gifstiker':
        case 'gifsticker':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) return client.reply(from, 'Gagal mengambil kode giphy', id)
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                console.log(giphyCode)
                const smallGiftUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                await client.sendGiphyAsSticker(from, smallGiftUrl).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const giftUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!giftUrl) return client.reply(from, 'Gagal mengambil kode giphy', id)
                const smallGiftUrl = url.replace(giftUrl[0], 'giphy-downsized.gif')
                await client.sendGiphyAsSticker(from, smallGiftUrl).catch((err) => console.log(err))
            } else {
                await client.reply(from, 'maaf, untuk saat ini sticker gif hanya bisa menggunakan link dari giphy.', id)
            }
            break
        // Video Downloader
        case 'ytmp4':
            let isLinks = text.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

            if (isLinks !== null) {
                client.reply('File akan segera kami proses, harap bersabar.')
                Ytdl('mp4', text).then(data => {
                    data.map(({ title, duration, videobase64 }) => {
                      let ytmp4 = `YT MP4 DOWNLOADER\n\n*${title}* [${duration}]\n\nTiming: ${istimer()}`

                      client.sendMessage(from, new MessageMedia('video/mp4', videobase64, 'ytmp4'), {
                          caption: ytmp4
                      })
                    })
                })
            } else {
                client.reply('link atau url tidak valid.')
            }
            insert(author, type, text, name, from, 'ytmp4')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'brainly':
            let message = `Halo ${name} 👋. Berikut hasil pencarian dari: *${text}* \n\n`
            Brainly(text).then(result => {
                let i = 1
                result.map(({ title, url }) => {
                    message += `${i++}. ${title}\nKlik Disini: ${url}\n\n`
                })
                client.reply(message)
            })
            insert(author, type, text, name, from, 'brainly')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'tiktok':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            downloader.tiktok(url).then(async (videoMeta) => {
                const filename = videoMeta.authorMeta.name + '.mp4'
                const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'}`
                await client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Video tanpa watermark tidak tersedia. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0', referer: 'https://www.tiktok.com/' } }, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            }).catch(() => client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid. [Invalid Link]', id))
            break
        case 'ig':
        case 'instagram':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('instagram.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            downloader.insta(url).then(async (data) => {
                if (data.type == 'GraphSidecar') {
                    if (data.image.length != 0) {
                        data.image.map((x) => client.sendFileFromUrl(from, x, 'photo.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                    if (data.video.length != 0) {
                        data.video.map((x) => client.sendFileFromUrl(from, x.videoUrl, 'video.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                } else if (data.type == 'GraphImage') {
                    client.sendFileFromUrl(from, data.image, 'photo.jpg', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type == 'GraphVideo') {
                    client.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                }
            })
                .catch((err) => {
                    if (err === 'Not a video') { return client.reply(from, 'Error, tidak ada video di link yang kamu kirim. [Invalid Link]', id) }
                    client.reply(from, 'Error, user private atau link salah [Private or Invalid Link]', id)
                })
            break
        case 'twt':
        case 'twitter':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
            if (!url.match(isUrl) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid', id)
            await client.sendText(from, '*Scraping Metadata...*')
            twitter(url)
                .then(async (videoMeta) => {
                    try {
                        if (videoMeta.type === 'video') {
                            const content = videoMeta.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                            const result = await urlShortener(content[0].url)
                            console.log('Shortlink: ' + result)
                            await client.sendFileFromUrl(from, content[0].url, 'TwitterVideo.mp4', `Link Download: ${result} \n\nDonasi: kamu dapat membantuku beli dimsum dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.`)
                        } else if (videoMeta.type === 'photo') {
                            for (let i = 0; i < videoMeta.variants.length; i++) {
                                await client.sendFileFromUrl(from, videoMeta.variants[i], videoMeta.variants[i].split('/media/')[1], '')
                            }
                        }
                    } catch (err) {
                        await client.sendText(from, 'Error, ' + err)
                    }
                }).catch(() => {
                    client.sendText(from, 'Maaf, link tidak valid atau tidak ada video di link yang kamu kirim')
                })
            break
        case 'fb':
        case 'facebook':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('facebook.com')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, '_Scraping Metadata..._ \n\nTerimakasih telah menggunakan bot ini, kamu dapat membantu pengembangan bot ini dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.', id)
            downloader.facebook(url).then(async (videoMeta) => {
                const title = videoMeta.response.title
                const thumbnail = videoMeta.response.thumbnail
                const links = videoMeta.response.links
                const shorts = []
                for (let i = 0; i < links.length; i++) {
                    const shortener = await urlShortener(links[i].url)
                    console.log('Shortlink: ' + shortener)
                    links[i].short = shortener
                    shorts.push(links[i])
                }
                const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                const caption = `Text: ${title} \n\nLink Download: \n${link.join('\n')} \n\nProcessed for ${processTime(t, moment())} _Second_`
                await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            })
                .catch((err) => client.reply(from, `Error, url tidak valid atau tidak memuat video. [Invalid Link or No Video] \n\n${err}`, id))
            break
        // Other Command
        case 'randomnime':
            Animhentai('anim').then(data => {
                client.reply(new MessageMedia('image/jpeg', data.data, 'aex-bot'))
            })
            insert(sender, type, text, name, from, 'randomnime')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'randomhentai':
            Animhentai('hentai').then(data => {
                client.reply(new MessageMedia('image/jpeg', data.data, 'aex-bot'))
            })
            insert(sender, type, text, name, from, 'randomhentai')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'wiki':
            Wiki(text)
                .then(data => {
                    client.reply(data.data)
                 })
                .catch(err => msg_.reply(err))
            insert(sender, type, text, name, from, 'wiki')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'sial':
            Primbon('sial', text).then(resp => {
                const { title, data } = resp

                client.reply(`${title}\n\n${data}`)
            })
            insert(sender, type, text, name, from, 'sial')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'jodoh':
            Primbon('jodoh', text).then(resp => {
                const { title, data } = resp

                client.reply(`${title}\n\n${data}`)
            })
            insert(sender, type, text, name, from, 'jodoh')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'artinama':
            Primbon('artinama', text).then(resp => {
                const { title, data } = resp

                client.reply(`${title}\n\n${data}`)
            })
            insert(sender, type, text, name, from, 'artinama')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'sifat':
            Primbon('sifat', text).then(resp => {
                const { title, data } = resp

                client.reply(`${title}\n\n${data}`)
            })
            insert(sender, type, text, name, from, 'sifat')
                .then(x => console.log('[:] DB has Insert'))
                .catch(err => console.log(err))
            break;
        case 'resi':
            if (args.length !== 2) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return client.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => client.sendText(from, result))
            break
        case 'translate':
            if (args.length != 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsg) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
                .then((result) => client.sendText(from, result))
                .catch(() => client.sendText(from, 'Error, Kode bahasa salah.'))
            break
        case 'ceklokasi':
            if (quotedMsg.type !== 'location') return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) client.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
            let data = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}`
            client.sendText(from, text)
            break
        case 'del':
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!quotedMsg) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
    case 'memesticker':
        if ((isMedia || isQuotedImage) && args.length >= 2) {
            const top = arg.split('|')[0]
            const bottom = arg.split('|')[1]
            const encryptMedia = isQuotedImage ? quotedMsg : message
            const mediaData = await decryptMedia(encryptMedia, uaOverride)
            const getUrl = await uploadImages(mediaData, true)
            const ImageBase64 = await meme.custom(getUrl, top, bottom)
                client.sendImageAsSticker(from, ImageBase64)
                    .then(() => {
                        client.reply(from, 'Here\'s your sticker')
                        console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                    })
                    .catch((err) => console.error(err))
        } else {
            await client.reply(from, 'Tidak ada gambar! Untuk membuka daftar perintah kirim #menu [Wrong Format]', id)
        }
        break
        case 'mim':
        case 'memes':
        case 'meme': {
            const { title, url } = await fetchMeme()
            await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        }
        case 'horror': {
            const { title, url } = await fetchHorror()
            await client.sendFileFromUrl(from, `${url}`, 'horror.jpg', `${title}`)
            break   
        }
        case 'milf':
        case 'MILF': {
            const { title, url } = await fetchMilf()
            await client.sendFileFromUrl(from, `${url}`, 'Milf.jpg', `${title}`)
            break
        }
        case 'bkp':
        case 'bokep': {
            const { title, url } = await fetchBkp()
            await client.sendFileFromUrl(from, `${url}`, 'Bkp.jpg', `${title}`)
            break
        }
        case 'ocr':
            if (isMedia) {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                const text = await getText(imageBase64)
                await client.sendText(from, text)
            } else if (quotedMsg && quotedMsg.type === 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                const text = await getText(imageBase64)
                await client.sendText(from, text)
            } else if (args.length === 1) {
                if (!url.match(isUrl)) await client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
                const text = await getText(url)
                await client.sendText(from, text)
            } else {
                await client.reply(from, 'Tidak ada gambar! Untuk membuka daftar perintah kirim #menu', id)
            }
            break
        // Group Commands (group admin only)
        
        case 'add':{
            if (chat.isGroup) {
                if (replace(author) === isBotGroupAdmins) 
                await client.addParticipant(groupId,[number])
            }
            break;
        }
        case 'kick':
        case 'wisuda':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
            await client.sendText(from, `Siap tuan, minggato wae:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText('Gagal, kamu tidak bisa mengeluarkan admin grup.')
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promote': {
            if (!isGroupMsg) return await client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return await client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return await client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length === 0) return await client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
            if (mentionedJidList.length >= 2) return await client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Siap tuan, anda naik kasta menjadi admin@${mentionedJidList[0].replace('@c.us', '')}`)
            break
        }
        case 'demote': {
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
            if (mentionedJidList.length >= 2) return await client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Siap tuan, anda turun kasta menjadi rakyat jelata. Mampus @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        }
	case 'mentionall':
	case 'everyone': {
    		if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
    		await client.sendTextWithMentions(from, `WOI KULIAH!!\n${mentionList(groupMembers)}`)
    		break
    }
    case 'everyoneanomali': {
        if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        await client.sendTextWithMentions(from, `PUSH RANK LAH NJAY!!\n${mentionList(groupMembers)}`)
        break
    }
    case 'tagall': {
        if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        await client.sendTextWithMentions(from, `WEDANGAN LAH BOY!!\n${mentionList(groupMembers)}`)
        break
    }
        case 'bye':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
            await client.sendText(from, 'Good bye... ( ⇀‸↼‶ )').then(() => client.leaveGroup(groupId))
            break
        default:
            console.log(color('[ERROR]', 'red'), color(time, 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

