powershell -command (new-object System.Net.WebClient ).DownloadFile('https://nodejs.org/dist/v5.5.0/win-x86/node.exe', '%~dp0node.exe')

node.exe twitch-ripper.js %1
