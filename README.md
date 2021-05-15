# AutoAction
`AutoAction` is a automation framework build on `Selenium`, it is used for:
1. Execute the actions (via flat line script) on web page automatically
2. Build up efficient, quick-start Automation Test projects

For example, if you want to do the following actions in browser: Open Amazon website and search with a keyword "Robot". You just write only 2 lines as below:
```
Open https://www.amazon.com
Search Robot
```
:high_brightness: Want [show cases](#showcases)

:books: Architecture

|  |   |   |   |   |
|---|---|---|---|---|
| [AutoBot](\autobot) [AutoWeb](\autoweb)
| AutoAction [AutoPlus](\autoplus) [AutoAnt](\autoant)
| Selenium | <-----> |Driver| <-----> |Browser

# Prerequisites
- Java: JDK8+
- Browser and browser driver (in case the browsers are installed at different machine, please refer to [Selenium Grid](https://www.selenium.dev/documentation/en/grid/), [Selenium Grid config sample](https://developers.perfectomobile.com/pages/viewpage.action?pageId=21435360) and skip this step)

## Install browser and driver
`AutoAction` is build from `Selenium` so it need browsers and associated drivers are required to be installed at the local machine for working.

- Firefox: 
    - Browser: http://getfirefox.com/
    - Firefox driver: https://github.com/mozilla/geckodriver/releases (For Window Vista/Windows 8, there are issues with the few recent versions, please get the version 0.17.0 https://github.com/mozilla/geckodriver/releases/tag/v0.17.0), copy driver file (e.g geckodriver.exe) to `autobot/bot/workspace/drivers` folder

- Chrome
    - Browser: from Google site
    - Chrome driver: https://chromedriver.storage.googleapis.com/index.html (remember to choose the correct driver version for your current Chrome browser, if your Chrome browser is updated to the next version then you should update the driver too), copy driver file (e.g chromedriver.exe) to `autobot/bot/workspace/drivers` folder
- Edge
    - Browser: https://www.microsoft.com/en-us/edge
    - Edge driver: https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/, copy driver file (e.g MicrosoftWebDriver.exe) to `autobot/bot/workspace/drivers` folder
    
:biohazard: **DO NOT** change the name of driver file else tool can not find the driver when running. For more details about web driver please refer to: https://www.selenium.dev/documentation/en/webdriver/driver_requirements/

# Run AutoActionBot
After ***JDK, browser*** are installed and ***driver*** are copied to `autobot/bot/workspace/drivers` folder, you can run the tool now
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

# AutoAction syntax
Each line in script is an action. Currently, below list is the supported actions:

| Action | Params | Explain	| Sample |
|---|---|---|---|
|Open|	url|	Open the url|**Open https://accounts.google.com/SignUp?lp=1&hl=en**
|Click|	guide_word(s)|Using guide_word(s) to find the an element and click it. "Guide keywords" could be id, class, display text of HTML element which help system find the target HTML element)| **Click Next**|
|Verify|expeted_displayed_text|	Return status "PASSED" if the expected text is displayed in current browser|**Verify this phone number format**|
|Wait|	number_of_seconds|	Wait in second(s). After some actions, we need to wait before run the next actions.|	**Wait 3**
|Input|	value guide_word(s)	|"Guide_words" could be id, class, display text of HTML element which help system find the target HTML element). "value" is the value to fill in input element.|**Input Tom Last Name** (for this action, `Tom` is the "value", and the rest `Last Name` is "guide_word(s)"|
|Search| value guide_word(s)|"Guide_words" could be id, class, display text of HTML element which help system find the target HTML element). "value" is the value to fill in input element and submit|**Search Robot search** (for this action, `Robot` is the "value", and the rest `search` is "guide_word(s)", if the second param is missing: **Search Robot**, it would have value "search"|
|Flag| config_field config_value|Using to put config value during running, and some other extra actions| **Flag wait.before.next 2** waiting 2 seconds before execute the next action|
|Area|guide_word(s)|Using guide_word(s) to find the an element, and the following actions searching scope will be narrowed down within founded element. This scope would be changed until the next `Area` action|**Area s-search-results**|
|Quit| |Close browser. This command must be the last action.|**Quit**|


System would skip all lines which contains unsupported actions.

To make the script more readable, the complex text (e.g. url, value with spaces) can be put in dictionary files (any file with extension *.dic) with format: key = value. Please refer to sample dictionarie file under `bot/workspace/scripts` folder: `url.dic`.

# Add more Actions
You can add more actions by define new classes for them ...

Please refer to sub module [AutoActionPlus](/AutoActionPlus)  :t-rex:


# Build up Automation Test project
For Automation Test project, please use refer to `TestDemo.java` file, you can write AutoAction script to do the actions and just write code for the verify the result.

**WILL BE UPDATED SOON**

# Showcases
## Post link to Facebook
:tv: https://youtu.be/eJSgX2IfDSY

Script file [fbPostLink](bot/workspace/scripts/showcases/fbPostLink.chl)

:warning: Normally, when a session start it will run a fresh browser, but this case we need a browser which must be logged in Facebook already. To overcome this one, we can use "profile", please change the Firefox profile( the default would be "default" or "default-release") in [firefox.config](bot/workspace/drivers/firefox.config)

`java -jar  autoactionbot-1.0-all.jar facebook.json`
