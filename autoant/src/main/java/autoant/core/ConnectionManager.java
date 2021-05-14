package autoant.core;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.UnexpectedAlertBehaviour;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.firefox.ProfilesIni;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

/*
 * Manage the connections to browser drivers
 */
public class ConnectionManager {
	public final static String CHROME = "CHROME";
	public final static String FIREFOX = "FIREFOX";
	public final static String EDGE = "EDGE";

	/*
	 * Create web driver and action context, return null if fail
	 */
	public static ActionContext buildContext(final String browser, final String driverPath) {
		WebDriver webDriver = null;
		final String browserString = browser.toUpperCase();
		
		if( browserString.contains(FIREFOX)) {
			webDriver = buildFFContext(driverPath);
		}else if(browserString.contains(CHROME)) {
			webDriver = buildChromeContext(driverPath);
		}else if (browserString.contains(EDGE)) {
			webDriver = buildEdgeContext(driverPath);
		}
		return webDriver != null ? new ActionContext(webDriver) : null;
	}		
	
	/*
	 * Build Firefox driver, using profile=default
	 */
	public static WebDriver buildFFContext(String driverPath) {		
		System.setProperty("webdriver.gecko.driver", driverPath);
		System.setProperty(FirefoxDriver.SystemProperty.DRIVER_USE_MARIONETTE,"true");
		
		// Disable notification
		ProfilesIni profile = new ProfilesIni();
		FirefoxProfile testprofile = profile.getProfile("default");
		testprofile.setPreference("dom.webnotifications.enabled", false);
		testprofile.setPreference("dom.push.enabled", false);
		
		FirefoxOptions options = new FirefoxOptions();
		options.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.ACCEPT);
		options.setCapability(FirefoxDriver.PROFILE, testprofile);
		
		return new FirefoxDriver(options);
	}		
	
	/*
	 * Build Chrome driver
	 */	
	public static WebDriver buildChromeContext(String driverPath) {
		System.setProperty("webdriver.chrome.driver", driverPath);
		
		ChromeOptions options = new ChromeOptions();
		
		Map<String, Object> prefs = new HashMap<String, Object>();
		prefs.put("profile.default_content_setting_values.notifications", 2);
		prefs.put("credentials_enable_service", false);
		prefs.put("profile.password_manager_enabled", false);

		options.setExperimentalOption("prefs", prefs);
		options.addArguments("start-maximized");
		options.addArguments("disable-infobars");
		options.addArguments("--disable-extensions");
		options.addArguments("--disable-notifications");		
		options.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.ACCEPT);
		
		return new ChromeDriver(options);
	}	
	
	/*
	 * Build MS Edge driver
	 */	
	public static WebDriver buildEdgeContext(String driverPath) {
		System.setProperty("webdriver.edge.driver", driverPath);
		
		EdgeOptions options = new EdgeOptions();
		options.setCapability("ms:inPrivate", true);
		options.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.ACCEPT);
		
		return new EdgeDriver(options);
	}	
		
}
