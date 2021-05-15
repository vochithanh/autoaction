# AutoBot
`AutoBot` is command like tool which is used for:
1. Execute the `AutoAction` script files
2. Build up efficient, quick-start Automation Test projects

# How to run
- Go to `bot` folder
- Run `java -jar  autoactionbot-1.0-all.jar`

Tool will:
- Read the default config file `aa.json`
```
{
"workspacePath":"workspace",
"browserString":"firefox",
"runScriptOnly":"true",
"scriptContent":"demo.chl"
}
```
- Open `Firefox` browser
- Execute `demo.chl` AutoAction script
```
Open https://www.amazon.com
Search Robot
```
- Above browser will open Amazon website, fill in keyword ***Robot*** and go to search result page

## Config file
You can run tool with selected config file: `java -jar  autoactionbot-1.0-all.jar [config_file]`
E.g. `java -jar  autoactionbot-1.0-all.jar sample.json`

`[config_file]` (a json file) parameters:
+ `workspacePath`: path to the workspace folder (please refer to `workspace` folder)
+ `browserString`: browser(s) to be used, e.g. `firefox` or `chrome` or `firefox,chrome,edge` ...
+ `runScriptOnly`: `true` -> run only below script, `false`: run below script and **all \*.chl files under above workspace** (please refer to *.chl files under `workspace/scripts` folder)
+ `scriptContent`: run a `AutoAction` script file in one session
+ `scriptFiles`: run multiple `AutoAction` script files in one session, please refer to `multifiles.json`
+ `subList`: run multiple `AutoAction` script files in multiple sessions, please refer to `sublist.json`

## Config browser field
The value for "browserString" field could be:

- `firefox` → Firefox browser
- `chrome` → Chrome browser
- `edge` → Edge browser
- http://[hub-ip]:[port]/wd/hub,[browser] for Selenium Grid case, e.g. `http://hub:4441/wd/hub,firefox`

# Build up Automation Test project
For Automation Test project, please use refer to `TestDemo.java` file, you can write `AutoAction` script to do the actions and just write code for the verify the result.

**WILL BE UPDATED SOON**

# Showcases
## Post link to Facebook
:tv: https://youtu.be/eJSgX2IfDSY

Script file [fbPostLink](bot/workspace/scripts/showcases/fbPostLink.chl)

:warning: Normally, when a session start it will run a fresh browser, but this case we need a browser which must be logged in Facebook already. To overcome this one, we can use "profile", please change the Firefox profile( the default would be "default" or "default-release") in [firefox.config](bot/workspace/drivers/firefox.config)

`java -jar  autoactionbot-1.0-all.jar facebook.json`
