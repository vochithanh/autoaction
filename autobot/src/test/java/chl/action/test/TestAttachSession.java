package chl.action.test;

import chl.core.io.ChlTestSuite;
import org.junit.jupiter.api.Test;

import java.io.File;

// Run scripts under [workspace\scripts\misc] folder
public class TestAttachSession extends TestAction {

    protected ChlTestSuite testAction(String name) {
        pass.setBrowserString("chrome");
        return testAction("misc" + File.separator + name,FLASH_CAPTURE, DUMMY);
    }

    protected ChlTestSuite attach(String name) {
        pass.setBrowserString("attach.action");
        return testAction("misc" + File.separator + name,FLASH_CAPTURE, DUMMY);
    }

    @Test
    void createChromeSession() { testAction("session"); }

    @Test
    void attachSession(){ attach("run"); }
}
