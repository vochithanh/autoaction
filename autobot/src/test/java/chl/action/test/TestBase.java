package chl.action.test;

import chl.core.io.ChlTestSuite;
import chl.gate.GatePass;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestBase {
	static public String workspacePath = "bot/workspace";
	static public ChlTestSuite ts;
	static public GatePass pass;

	@BeforeAll
	static void setUpBeforeClass() throws Exception {
		pass = new GatePass("firefox",workspacePath,"",true);
	}
	
	@AfterEach
	void tearDown() throws Exception {
		assertTestSuite();
	}	
	
	void assertTestSuite() {
		System.out.println(ts);
		assertTrue(ts.getStatus().replaceAll("[(null)|(DONE)|(FINISH)|(NAN)|\\[|\\]|\\,]", "").trim().length() == 0, "Test suite is not Done all");
	}
}


