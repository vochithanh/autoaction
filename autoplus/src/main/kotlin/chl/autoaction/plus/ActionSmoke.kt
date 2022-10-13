package chl.autoaction.plus

import chl.action.behavior.ActionBhv
import chl.core.util.Log.log
import chl.ext.waitReady
import org.openqa.selenium.WebElement
import sln.app.Context
import sln.app.action.strategy.StrategyHelper

// Action: Detect and open all links
var linkLabelMap = mutableMapOf<String, String>()
fun getLabel(link: String) = linkLabelMap.entries.find { link.contains(it.key) }?.value ?: ""

open class ActionSmoke(context: Context, params: List<String>) : ActionBhv(context, params) {
    val LINK_TAG_LIST = listOf("a")

    var ignores = listOf("");
    var visited = mutableListOf<String>()
    var visitedHref = mutableListOf<String>()
    var visitedUrl = mutableListOf<String>()
    var tabIds = mutableListOf<String>()


    override fun lookup() {
        super.lookup()
        linkLabelMap.clear()

        ignores = param.split(",")
    }

    override fun action() {
        super.action()
        visit(0, 0)
    }

    fun visit(level: Int, count: Int) {
        log("Level: $level")
        log(driver.currentUrl)

        if (level <= 50 && count <= 100 && !visitedUrl.contains(driver.currentUrl)) {
            driver.waitReady()
            helper.wait(10)
            val label = getLabel(driver.currentUrl)
            val curHandle = driver.windowHandle
            tabIds.add(curHandle)
            visitedUrl.add(driver.currentUrl)

            context.setDefaultArea()
            val root = context.areaEle
            val links = links(root);

            var linkCount = 0
            kotlin.runCatching {
                links.filterNot { e ->
                    helper.inValid(e) || visited.contains(e.text)
                            || visitedHref.contains(e.getAttribute("href"))
                            || ignores.any { ignore -> e.text.contains(ignore.trim(), ignoreCase = true) }
                            || ignores.any { ignore -> e.getAttribute("href").contains(ignore.trim(), ignoreCase = true) }

                }.forEach {
                    it.runCatching {
                        visited.add(text)
                        val href = it.getAttribute("href")
                        visitedHref.add(href)
                        helper.ctlClick(it)
                        linkLabelMap.put(href, "$label -> $text")
                        linkCount++
                    }
                }
            }

            log("Open $linkCount links")
            // Next tab
            nextTab()
            //close()
            visit(level + 1, count + linkCount)
        } else if (level <= 10 && count <= 100) {
            // Next tab
            nextTab()
            //close()
            visit(level + 1, count)
        }

    }


    fun links(root: WebElement) = StrategyHelper.findByTags(root, LINK_TAG_LIST, clickableFilter)


    fun nextTab() {
        driver.run {
            windowHandles.find { !tabIds.contains(it) }?.run {
                switchTo().window(this)
                waitReady()
            }
        }
    }

    fun close() {
        driver.run {
            log(windowHandles.size)
            close();
            log(windowHandles.size)
            switchTo().window(windowHandles.elementAt(0))
        }
    }
}

