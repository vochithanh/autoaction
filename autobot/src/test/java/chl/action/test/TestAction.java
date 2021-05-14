package chl.action.test;

import chl.core.io.ChlTestSuite;
import chl.core.util.Resource;
import chl.gate.GateBoss;
import chl.gate.GatePass;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import sln.app.Context;

import java.io.File;
import java.util.Arrays;

public class TestAction extends TestBase {
    public final static String FLASH = "Flag basic.border.element 2";
    public final static String CAPTURE = "Flag basic.capture.element true";
    public final static String RECORDER_START = "Flag max.screen start, screen.recorder start 0 100 avi";
    public final static String RECORDER_STOP = "Flag screen.recorder stop";
    public final static String FLASH_CAPTURE = FLASH + System.lineSeparator() + CAPTURE;
    public final static String QUIT = "Quit";

    // load file in [scripts] folder under [workspace]
    protected ChlTestSuite testAction(String name, String preScript, String postScript) {
        final String filePath = pass.getWorkspacePath() + String.format("%sscripts%s%s.chl", File.separator,File.separator, name);
        pass.setScriptContent(String.join(System.lineSeparator(), Arrays.asList(preScript,Resource.loadResouce(filePath),postScript)));
        ts = GateBoss.run(pass);
        return ts;
    }

    protected ChlTestSuite testAction(String name) {
	    return testAction(name,FLASH_CAPTURE, "");
    }

}
