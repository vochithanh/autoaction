package chl.autoaction.plus

import chl.action.behavior.ActionBhv
import chl.core.util.Log.log
import chl.ext.waitReady
import org.openqa.selenium.WebElement
import sln.app.Context
import sln.app.action.strategy.StrategyHelper
import vlin.Fsep
import vlin.coFile
import vlin.ext.runElse
import vlin.ext.runIf

// Action: Scan all current tabs and detect bad links
open class ActionBadLink(context: Context, params: List<String>) : ActionBhv(context, params) {

    var badTexts: List<String>? = null

    override fun lookup() {
        super.lookup()
        badTexts = param.split(",")
    }

    override fun action() {
        super.action()
        scanTabs()

        linkLabelMap.clear()
    }

    fun scanTabs() = driver.run {
        val badLinkFile = coFile(outputPath() + Fsep + "badlinks.log", true)
        log("Total open links: ${windowHandles.size}")
        var badCount = 0
        while (windowHandles.size > 0) {
            waitReady()
            helper.wait(5)
            context.setDefaultArea()
            var root = context.areaEle
            badTexts?.any { root.text.contains(it.trim(), ignoreCase = true) }.runIf {
                //helper.takeScreen(root)
                helper.takeScreen()
                log("Bad link: $currentUrl")
                val label = getLabel(currentUrl)
                badLinkFile?.appendText("$label -> $currentUrl" + System.lineSeparator())
                badCount++
            }

            (windowHandles.size > 1).runIf { this@ActionBadLink.close() }
            if( windowHandles.size == 1) break
        }
        log("Total bad links: $badCount")
    }

    // close current tab and switch to other tab
    fun close() {
        driver.run {
            close();
            switchTo().window(windowHandles.elementAt(0))
        }
    }
}

