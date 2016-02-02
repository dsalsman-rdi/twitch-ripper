if not exist node.exe (
	powershell -command "& { iwr https://nodejs.org/dist/v5.5.0/win-x86/node.exe -OutFile %~dp0node.exe}"
)

node.exe twitch-ripper.js %1