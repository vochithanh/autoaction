package chl.autoaction.plus.loop

import chl.action.data.ActionRow
import chl.action.loop.ActionLoop
import sln.app.Context
import vlin.coCsv

// Repeat next actions [n] times
class ActionRepeat(context: Context, params: List<String>) : ActionLoop(context, params) {
    override fun lookup() {
        super.lookup()
        val count = param.toInt()
        subActions = IntRange(0,count).map { ActionRow(context, params) }
    }

}