package chl.autoaction.plus

import chl.action.ActionCore
import chl.action.data.ActionFlag
import chl.action.loop.ActionFork
import chl.core.util.Log.log
import chl.ext.body
import chl.ext.display
import chl.ext.enabledChildren
import org.openqa.selenium.WebElement
import sln.app.Context
import sln.app.action.Action
import vlin.ext.nullApply

// Expected: all text of enabled elements include at least one item in params
class ActionExpected(context: Context, params: List<String>) : ActionCore(context, params) {
    private val vfunList = mutableListOf(vfunDisplayContaint)
    override fun action() {
        super.action()
        val option = helper.getFlagValue(ActionFlag.Keys.verify_option.text) ?: ""
        val verifyNo = option.contains("no",true)
        val checkEle = when{
            option.contains("ele",true) -> context.currentEle
            else -> context.areaEle
        }

        // should pass at least 1 rule
        vfunList.find { it(this, checkEle) == !verifyNo }.nullApply {
            status = Action.Status.FAIL
        }

    }

    override fun afterAction() {
        if (status != Action.Status.FAIL) super.afterAction()
        else   // looking fork and run it
            helper.findAheadAction(ActionContinue::class.java, param)?.run {  take(); }
    }
}

typealias VerifyFun = (ActionCore, WebElement) -> Boolean

// Verify: all child enabled elements contain text in params
val vfunDisplayContaint: VerifyFun = { action, ele ->
    action.run {
        ele.enabledChildren(driver)?.filter{ it.getAttribute("disabled") != "true" }?.any { log(ele.text); param.split(" ").any{ ele.text.contains(it, true)} }?:false
    }
}
