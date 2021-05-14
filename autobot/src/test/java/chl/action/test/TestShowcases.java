package chl.action.test;

import chl.core.io.ChlTestSuite;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import sln.app.Context;

import java.io.File;

// Run scripts under [workspace\scripts\showcases] folder
public class TestShowcases extends TestAction {

    protected ChlTestSuite testAction(String name) {
        pass.setBrowserString("chrome");
        return testAction("showcases" + File.separator + name,FLASH_CAPTURE + System.lineSeparator() + RECORDER_START, RECORDER_STOP);
    }

    @Test
    void facebookPostLink() { testAction("fbPostLink"); }
}
