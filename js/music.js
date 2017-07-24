const log = console.log.bind(console)
const e = (selector) => document.querySelector(selector)
const bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.addEventListener(eventName, callback)
    }
}
const songsData = [
    {
        src: 'songs/0.mp3',
        id: '0',
        name: 'Croatian Rhapsody',
        singer: '马克西姆.姆尔维察'
    },
    {
        src: 'songs/1.mp3',
        id: '1',
        name: 'Somebody That i Used to Know',
        singer: 'Gotye、Kimbra'
    },
    {
        src: 'songs/2.mp3',
        id: '2',
        name: 'Radioactive',
        singer: 'William Joseph'
    },
    {
        src: 'songs/3.mp3',
        id: '3',
        name: '喜欢你',
        singer: '邓紫棋'
    },
    {
        src: 'songs/4.mp3',
        id: '4',
        name: '大王叫我来巡山',
        singer: '贾乃亮、贾云馨'
    },
    {
        src: 'songs/5.mp3',
        id: '5',
        name: '你还要我怎样',
        singer: '薛之谦'
    },
]
const aud = e('#id-audio-player')

const insertMusicList = (song) => {
    var id = song.id
    var n = song.name
    var s = song.singer
    t = `
        <p class="song" data-id="${id}">${n} -- ${s}</p>
    `
    e('.music-files').insertAdjacentHTML('beforeEnd', t)
}

const loadMusicList = () => {
    for (var i = 0; i < songsData.length; i++) {
        var song = songsData[i]
        insertMusicList(song)
    }
}
const bindMusicList = () => {
    e('#id-span-musicList').addEventListener('click', function(){
        e('.list-backgound').classList.toggle('list-show')
        e('.music-files').classList.toggle('list-show')
    })
}

// 切换显示曲名信息
const changeName = () => {
    var id = aud.dataset.id
    for (var i = 0; i < songsData.length; i++) {
        var song = songsData[i]
        if (song.id == id) {
            var h2 = song.name
            e('#id-h2-singName').innerHTML = h2
            var p = song.singer
            e('#id-p-singer').innerHTML = p
        }
    }
}


// 实际播放
const playing = () => {
    var start = e('#id-div-start')
    var stop = e('#id-div-stop')
    start.classList.remove('play-show')
    stop.classList.add('play-show')
    changeName()
    e('.logo-rotate').classList.add('rotate')
    aud.play()
}
// 实际暂停
const bindstoped = () => {
    var start = e('#id-div-start')
    var stop = e('#id-div-stop')
    stop.addEventListener('click', function(event){
        aud.pause()
        e('.logo-rotate').classList.remove('rotate')
        // 切换符号
        start.classList.add('play-show')
        stop.classList.remove('play-show')
    })
}
// 播放、暂停
const bindStart = () => {
    var start = e('#id-div-start')
    var stop = e('#id-div-stop')
    start.addEventListener('click', function(event){
        if (aud.dataset.id == '') {
            var next = songsData[0]
            aud.src = next.src
            aud.dataset.id = next.id
        }
        playing()
    })

}
// 通用
const nextSong = (i, offset) => {
    if (aud.dataset.id == '') {
        var next = songsData[i]
        aud.src = next.src
        aud.dataset.id = next.id
    } else {
        var nowId = Number(aud.dataset.id)
        var len = songsData.length
        var nextId = (len + nowId + offset) % len
        var next = songsData[nextId]
        aud.src = next.src
        aud.dataset.id = next.id
    }
}
// 列表点歌
const bindClickSong = () => {
    bindAll('.song', 'click', function(event){
        var self = event.target
        log('123hahaha', self)
        var nextId = Number(self.dataset.id)
        var next = songsData[nextId]
        aud.src = next.src
        aud.dataset.id = next.id
        if (e('.song-play') != null) {
            e('.song-play').classList.remove('song-play')
        }
        self.classList.add('song-play')
        playing()
    })
}
// 下一曲
const bindNext = () => {
    var next = e('#id-div-next')
    next.addEventListener('click', function(event){
        var i = 0
        var offset = 1
        nextSong(i, offset)
        playing()
    })
}
// 上一曲
const bindPrevious = () => {
    var previous = e('#id-div-previous')
    previous.addEventListener('click', function(event){
        var i = songsData.length - 1
        var offset = -1
        nextSong(i, offset)
        playing()
    })
}
// 切换播放模式
const playNext = () => {
    var i = 0
    var offset = 1
    nextSong(i, offset)
    playing()
}
const playSelf = () => {
    playing()
}
const playRamdon = () => {
    var len = songsData.length
    var n = Math.random() * len
    n = Math.floor(n)
    var next = songsData[n]
    aud.src = next.src
    aud.dataset.id = next.id
    playing()
}
const changeModeButton = () => {
    bindAll('.mode', 'click', function(event){
        var ml = e('.modeList')
        var nowI = ml.dataset.mode
        var nextI = String((Number(nowI) + 1) % 3)
        var self = event.target
        self.classList.remove('mode-show')
        var nextId = '#id-mode-' + nextI
        e(nextId).classList.add('mode-show')
        ml.dataset.mode = nextI
    })
}
const bindMode = () => {
    var s = [playNext, playSelf, playRamdon]
    aud.addEventListener('ended', function(event){
        var start = e('#id-div-start')
        var stop = e('#id-div-stop')
        start.classList.add('play-show')
        stop.classList.remove('play-show')
        var ml = e('.modeList').dataset.mode
        var i = Number(ml)
        var modeName = s[i]
        log(modeName, i, 'YYY')
        modeName()
    })
}
const changePlayMode = () => {
    changeModeButton()
    bindMode()
}
// 改变时间类型
const time = (second) => {
    var m = Math.floor(second / 60)
    m = String(m)
    if (m.length < 2) {
        m = '0' + m
    }
    var s = Math.ceil(second % 60)
    s = String(s)
    if (s.length < 2) {
        s = '0' + s
    }
    t = `${m}:${s}`
    return t
}
// 显示时间
const showTime = () => {
    aud.addEventListener('canplay', function(){
        var dur = aud.duration
        aud.addEventListener('timeupdate', function(){
            var d = time(dur)
            e('.duration').innerHTML = d
            var cur = aud.currentTime
            var val = String((cur * 100) / dur)
            e('.range').value = val
            var c = time(cur)
            e('.current').innerHTML = c
            var b = e('.range').value
            var t = `linear-gradient(90deg, rgba(14, 104, 98, 1)${b}%, rgba(255, 255, 255, 1)${b}%)`
            e('.range').style.background = t
        })
    })
}
// 拖动进度条改变播放进度
const bindRange = () => {
    var range = e('.range')
    range.addEventListener('input', function(event){
        var v = range.value
        var dur = aud.duration
        aud.currentTime = dur * v / 100
        showTime()
    })
}
// 拖动音量条改变音量
const bindvolume = () => {
    var v = e('#id-div-volume')
    var vol = e('#id-input-volume')
    v.addEventListener('click',function(event){
        vol.classList.toggle('volume-show')
    })
    vol.addEventListener('input', function(event){
        var val = vol.value / 100
        aud.volume = val
        var b = vol.value
        var t = `linear-gradient(90deg, rgba(14, 104, 98, 1)${b}%, rgba(255, 255, 255, 1)${b}%)`
        vol.style.background = t
    })
}
window.onload = function() {
    e('.particles-js-canvas-el').width = '414'
    e('.particles-js-canvas-el').height = '636'
}
const __main = () => {
    loadMusicList()
    bindMusicList()
    bindStart()
    bindstoped()
    changePlayMode()
    bindClickSong()
    bindNext()
    bindPrevious()
    showTime()
    bindRange()
    bindvolume()
}
__main()
