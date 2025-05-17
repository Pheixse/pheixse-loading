fx_version 'cerulean'
game 'gta5'
lua54 'yes'
author 'Pheixse'
description 'Pheixse Loading Screen'
version '1.0.0'

loadscreen 'ui/index.html'
loadscreen_cursor 'yes'
files {
    'ui/index.html',
    'ui/css/style.css',
    'ui/script/script.js',
    'ui/script/config.js',
    'ui/assets/*',
    'ui/assets/music/*'
}

server_scripts {
    'server.lua'
}

client_scripts {
    'client.lua'
}

