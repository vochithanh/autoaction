package chl.autoaction.plus

import org.junit.jupiter.api.Test
import sln.app.Context

internal class ActionInputRTest {

    @Test
    fun genRandom() {
        val pattern = "***##@abc.com"
        val action = ActionInputR(Context("",null), listOf(pattern,"keyword"))
        action.param = action.genRandom(pattern)
        assert(action.param.length == pattern.length && action.param.endsWith("@abc.com"),lazyMessage = {"Result of $pattern is ${action.param}"})
    }
}