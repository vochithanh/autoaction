package chl.autoaction.bot

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeAll

internal class BotKtTest {

    @BeforeEach
    fun setUp() {
        root = "bot"
    }

    @AfterEach
    fun tearDown() {
    }

    @Test
    fun main(){ main(arrayOf()) }

    @Test
    fun mainMultifiles() { main(arrayOf("multifiles.json")) }

    @Test
    fun mainSublist() { main(arrayOf("sublist.json")) }

    @Test
    fun mainRepeat(){ main(arrayOf("repeat.json")) }

    @Test
    fun testSmoke(){ main(arrayOf("smoke.json")) }
}