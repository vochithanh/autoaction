package chl.autoaction.plus.loop

import chl.action.data.ActionRow
import chl.action.loop.ActionDetectItem
import chl.action.loop.ActionLoop
import chl.ext.dom
import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import sln.app.Context
import vlin.coCsv

// Detect all available links
class ActionLinks(context: Context, params: List<String>) : ActionLoop(context, params) {
    override fun lookup() {
        super.lookup()
        val count = param
        val links = context.areaEle.findElements<WebElement>(By.tagName("a"))
        subActions = links.map{ l -> ActionDetectItem(context, params).apply {
            result = l
            this.areaDom = result?.dom()?:"" // store the [dom] of detected item for later using if needed
        } }
    }

}