package chl.autoaction.plus

import chl.action.behavior.ActionInput
import sln.app.Context

// Action: Input random value based on pattern [* -> a-z, # -> 0-9]
open class ActionInputR(context: Context, params: List<String>) : ActionInput(context, params) {

    // generate value from [pattern], [***###@abc.com] -> [dfe346@abc.com]
    override fun lookup() {
        super.lookup()
        param = genRandom(param)
    }

    fun genRandom(pattern: String) = String(pattern.map { c ->
        when(c){
            '*' -> 'a'.plus((0..24).random())
            '#' -> '0'.plus((0..9).random())
            else -> c
        }
    }.toCharArray())

}