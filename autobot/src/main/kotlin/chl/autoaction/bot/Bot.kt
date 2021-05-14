package chl.autoaction.bot

import chl.core.io.ChlTestSuite
import chl.gate.GateBoss
import chl.gate.GatePass
import kotlinx.coroutines.runBlocking
import vlin.ext.fromJson
import vlin.ext.nullApply
import vlin.ext.runElse
import vlin.ext.runIf
import vlin.interval
import java.io.File

// java -jar autoactionbot-1.0-all.jar [config_file]
// to run this main function working folder should be .\bot
fun main(args: Array<String>) {
    textFile(args.getOrNull(0) ?: "aa.json").fromJson<BotPass>()?.apply { popDown() }?.run{
        val pass = this
        if (schedule == null) run(pass) else runBlocking {
            interval(schedule!!.interval* 1000L) {run(pass); --schedule!!.count != 0L;}
        }
    }
}

var root = ""
fun textFile(path:String) = runCatching { File(rootPath(path)).readText() }.getOrElse {""}

fun rootPath(path:String) = if( root.isNotEmpty()) "$root${File.separatorChar}$path" else path

fun run(botPass:BotPass?):Unit? = botPass?.run{
    // generate final script from [scriptContent] or [scriptFiles]

    val finalScript = mutableListOf(scriptContent?:"").plus(scriptFiles?: listOf()).joinToString(System.lineSeparator(), transform = ::textFile)

    // only run if final script not empty
    finalScript.isNotEmpty().runIf {
        val result = GateBoss.run(GatePass(browserString, rootPath(workspacePath), finalScript, isRunScriptOnly))
        println(result)
    }

    // run subList
    subList?.forEach { run(it) }
}
