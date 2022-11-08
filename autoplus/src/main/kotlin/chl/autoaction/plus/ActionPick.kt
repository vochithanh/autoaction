package chl.autoaction.plus

import chl.action.behavior.ActionBhv
import chl.action.behavior.ActionInput
import chl.action.data.ActionRow
import chl.action.loop.ActionTable
import sln.app.Context
import vlin.coCsv
import vlin.coFile

// Action: Pick the first item in csv file and put to context
open class ActionPick(context: Context, params: List<String>) : ActionBhv(context, params) {

    override fun lookup() {
        super.lookup()
        context.resourceMap.run {
            val file = keys.find { it.endsWith(param) } ?: ""
            val csv = coCsv(file)
            csv?.second?.first()?.run {
                ActionRow(context, listOf(csv.first, this)).take()
                csv.second.drop(1)
                // Consume the first row, update the csv file
                coFile(file)?.writeText(csv.first + System.lineSeparator() +
                        csv.second.drop(1).joinToString(System.lineSeparator()))
            }

        }
    }
}