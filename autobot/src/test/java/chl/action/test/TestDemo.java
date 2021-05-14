package chl.action.test;

import chl.core.io.ChlTestSuite;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.springframework.core.io.ContextResource;
import sln.app.Context;

import java.io.File;

// Under test browser can be change in TestBase.setUpBeforeClass()
public class TestDemo extends TestAction {
    
    protected ChlTestSuite testAction(String name) {
        pass.setBrowserString("chrome");
        return testAction(name, FLASH_CAPTURE + System.lineSeparator() + RECORDER_START, RECORDER_STOP);
    }

    @Test
    void googleAcc() { testAction("gooacc"); }

    @Test
    void microsoftAcc() { testAction("msacc"); }

    @Test
    void amazonSearch(){
        ChlTestSuite result = testAction("amzsearch");
        Context ctx = result.getContext();
        WebDriver webDriver = ctx.getDriver();
        // dev can use the [result] and [webdriver] to write code for the Verify
    }

    @Test
    void multiBrowsers(){
        pass.setBrowserString("firefox,edge");
        testAction("multibrowsers");
    }
}
