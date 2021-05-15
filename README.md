# AutoAction
`AutoAction` is an automation framework build on `Selenium`, it is used for:
1. Execute the actions (via flat line script) on web page automatically
2. Build up efficient, quick-start Automation Test projects by handling 80% common tasks (you would take the rest 20% :banana:)

For example, if you want to do the following actions in browser: Open Amazon website and search with a keyword "Robot". You just write only 2 lines as below:
```
Open https://www.amazon.com
Search Robot
```
:high_brightness: Want [show cases](#showcases)

:books: Architecture

|  |   |   |   |   |
|---|---|---|---|---|
| [AutoBot](autobot) [AutoWeb](autoweb)
| AutoAction [AutoPlus](autoplus) [AutoAnt](autoant)
| Selenium | <-----> |Driver| <-----> |Browser

# Prerequisites
- Java: JDK8+
- Browser and browser driver (in case the browsers are installed at different machine, please refer to [Selenium Grid](https://www.selenium.dev/documentation/en/grid/), [Selenium Grid config sample](https://developers.perfectomobile.com/pages/viewpage.action?pageId=21435360) and skip this step)

## Install browser and driver
`AutoAction` is built from `Selenium` so it need browsers and associated drivers are required to be installed at the local machine for working.

- Firefox: 
    - Browser: http://getfirefox.com/
    - Firefox driver: https://github.com/mozilla/geckodriver/releases (For Window Vista/Windows 8, there are issues with the few recent versions, please get the version 0.17.0 https://github.com/mozilla/geckodriver/releases/tag/v0.17.0), copy driver file (e.g geckodriver.exe) to `autobot/bot/workspace/drivers` folder

- Chrome
    - Browser: from Google site
    - Chrome driver: https://chromedriver.storage.googleapis.com/index.html (:warning: please choose the correct driver version for your current Chrome browser, if your Chrome browser is updated to the next version then you should update the driver too), copy driver file (e.g chromedriver.exe) to `autobot/bot/workspace/drivers` folder

- Edge
    - Browser: https://www.microsoft.com/en-us/edge
    - Edge driver: https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/, copy driver file (e.g MicrosoftWebDriver.exe) to `autobot/bot/workspace/drivers` folder
    
:biohazard: **DO NOT** change the name of driver file else tool can not find the driver when running. For more details about web driver please refer to: https://www.selenium.dev/documentation/en/webdriver/driver_requirements/

# Where to go
After ***JDK, browser*** are installed and ***driver*** are copied to [drivers folder](autobot/bot/workspace/drivers) folder, it is ready to:
- Use [AutoBot](autobot) to run the `AutoAction` script files from command line :rat:
- Use [AutoWeb](autoweb) to manage and run `AutoAction` scripts from web app :elephant:
- [AutoPlus](autoplus) sample to extends the framework :butterfly:
- Love to code test script by Java programming language please go to [AutoAnt](autoant) :ant:

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


:do_not_litter: System would skip all lines which contains unsupported actions.

To make the script more readable, the complex text (e.g. url, value with spaces) can be put in dictionary files (any file with extension *.dic) with format: key = value. Please refer to sample dictionary file under `autobot/bot/workspace/scripts` folder: `url.dic`.

# Showcases

:tv: [Demo search on Amazon](https://youtu.be/YLVLYqCjPn0)

:tv: [Lab app - Buy a product](https://youtu.be/A_MoaVehx68)

:tv: [Lab app - Buy a dress](https://youtu.be/-mJ2KX6f424)

:tv: [Lab app - Regsiter account](https://youtu.be/dYFkBcTAJ7U)

:tv: [Post link to Facebook](https://youtu.be/eJSgX2IfDSY)