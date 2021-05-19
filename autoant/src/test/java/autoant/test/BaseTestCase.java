package autoant.test;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

import autoant.core.ActionContext;
import autoant.core.ActionManager;
import autoant.core.AttachCommandExecutor;
import autoant.core.ConnectionManager;

public class BaseTestCase {
	public final static String DRIVER_FOLDER = "../autobot/bot/workspace/drivers/";
	protected String browser = "firefox"; // should be: firefox, chrome or edge
	protected String driverPath = DRIVER_FOLDER + "geckodriver.exe"; // path to browser driver
	protected ActionManager manager;
	
	@BeforeEach
	public void before() throws Exception {		
		boolean attachCase = false;

		// Chrome case
		// browser = "chrome";
		// driverPath = DRIVER_FOLDER + "chromedriver.exe";

		// Attach case
		final String driverUrl = "http://localhost:8572";
		final String session = "e74e52ba-3789-4da9-a4d2-83be3df2faa3";
		// attachCase = true;

		if( attachCase){
			attach(driverUrl, session);
		}else{
			manager = new ActionManager(ConnectionManager.buildContext(browser, driverPath));
			// print out the session data which used for attach later
			AttachCommandExecutor.printSessionData(manager.getContext().getDriver());
		}
		 
	}

	@AfterEach
	public void after() throws Exception {
		// print logs
		// manager.getContext().printActionLogs();
		
		// clean up resources
//		manager.getContext().getDriver().close();
	}

	public void attach(final String driverUrl, final String session){
		manager = new ActionManager(new ActionContext(AttachCommandExecutor.buildAttachContext(driverUrl, session)));
	}
}
