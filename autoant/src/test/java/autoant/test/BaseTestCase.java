package autoant.test;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

import autoant.core.ActionContext;
import autoant.core.ActionManager;
import autoant.core.ConnectionManager;

public class BaseTestCase {
	public final static String DRIVER_FOLDER = "../autobot/bot/workspace/drivers/";
	protected String browser = "firefox"; // should be: firefox, chrome or edge
	protected String driverPath = DRIVER_FOLDER + "geckodriver.exe"; // path to browser driver
	protected ActionManager manager;
	
	@BeforeEach
	public void before() throws Exception {
//		browser = "chrome";
//		driverPath = DRIVER_FOLDER + "chromedriver.exe";
		manager = new ActionManager(ConnectionManager.buildContext(browser, driverPath));
	}

	@AfterEach
	public void after() throws Exception {
		// print logs
//		manager.getContext().printActionLogs();
		
		// clean up resources
//		manager.getContext().getDriver().close();
	}
}
