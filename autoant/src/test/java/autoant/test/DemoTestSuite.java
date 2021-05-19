package autoant.test;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;

public class DemoTestSuite extends BaseTestCase {

	@Test
	public void orangeHRM() {
		// 1) Open app and login
		manager.open("https://orangehrm-demo-6x.orangehrmlive.com/").click("button","Login as a Different Role").click("a","ESS User");

		// 2) Select Apply menu item
		manager.waitForLoad("Dashboard").click("menu_leave_viewLeaveModule").click("span","Apply").waitForLoad("From Date");

		//3) Fill in data
		manager.click("leaveType_inputfileddiv").click("span","Sick Leave - US").wait(3).click("date-picker-open-icon").click("button","Today");
		manager.input("comment","AutoAction demo");

		// 4) Submit
		manager.click("button","Apply");  

		// VERIFY FINAL RESULT
		final List<String> logs = manager.getContext().getActionLogs();
		assertFalse( logs.stream().anyMatch( (log) -> { return log.contains("[FAIL]"); }), "There is FAIL step!");
	}

	// this one attach to current running session which help us when to continue previous tasks instead of running from beginning.
	// @Test
	public void attachCurrentSession() {
		// continue tasks....

		//3) Fill in data
		manager.click("leaveType_inputfileddiv").click("span","Sick Leave - US").wait(3).click("date-picker-open-icon").click("button","Today");
		manager.input("comment","AutoAction demo");

		// 4) Submit
		manager.click("button","Apply");  
	}	
}
