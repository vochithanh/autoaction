package autoant.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
/*
 * Holding the context data for running auto actions
 */
public class ActionContext {
	protected WebDriver driver;
	private WebElement rootElement; // the root element which help narrow down the searching scope (instead of whole DOM tree)
	protected Map<String,String> dataMap = new HashMap<>();
	protected List<String> actionLogs; // logging the auto actions
	
	public ActionContext(final WebDriver driver) {
		this.driver = driver;
		initActionLogs();
	}
	
	public WebDriver getDriver() {
		return driver;
	}
	public void setDriver(WebDriver driver) {
		this.driver = driver;
	}
	public WebElement getRootElement() {
		if( rootElement == null || ExpectedConditions.stalenessOf(rootElement).apply(driver)) {
			setRootElement(null);
		}
		return rootElement;
	}

	public Map<String, String> getDataMap() {
		return dataMap;
	}
	public void setDataMap(Map<String, String> dataMap) {
		this.dataMap = dataMap;
	}
	
	public void initActionLogs() {
		actionLogs = new ArrayList<>();
	}
	
	public void logAction(final String log) {
		actionLogs.add(log);
	}
	
	/*
	 * Update the root element, if the value is null set root element to [body] element
	 */
	public void setRootElement(WebElement element) {
		if( element != null) {
			rootElement = element;
		}else {
			rootElement = driver.findElement(By.tagName("body"));
		}
	}
	
	public void printActionLogs() {
		System.out.println(actionLogs.toString());
	}
}
