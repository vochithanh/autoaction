package chl.autoaction.bot

import chl.gate.GatePass
import vlin.ext.nullApply
import vlin.ext.runIf

class BotPass(browserString: String?, workspacePath: String, scriptContent: String?, runScriptOnly: Boolean, var schedule:Schedule?):GatePass(browserString, workspacePath, scriptContent, runScriptOnly) {
    var scriptFiles: List<String>? = null
    var subList : List<BotPass>? = null
    // populate down some data from parent to sublist if missing
    fun popDown(){
        subList?.forEach {
            it.browserString.isNullOrEmpty().runIf{ it.browserString = browserString}
            it.workspacePath.isNullOrEmpty().runIf{ it.workspacePath = workspacePath}
            it.isRunScriptOnly = isRunScriptOnly
            it.scriptContent.isNullOrEmpty().runIf{ it.scriptContent = scriptContent }
            it.scriptFiles.isNullOrEmpty().runIf{ it.scriptFiles = scriptFiles}
            it.popDown()
        }
    }
}

// interval: period in second, count: 0 means forever
class Schedule(var interval: Long = 1L, var count: Long = 1L)