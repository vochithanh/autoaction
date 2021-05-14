package autoant.core;

import java.util.List;
import java.util.function.Predicate;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/*
 * Provide the implement of auto actions
 */
public class ActionManager {
	public static final String ACTION_LOG_FORMAT = "%s [%s]";
	public static final int WAIT_LOAD_TIMEOUT = 60; //seconds
	protected ActionContext context;
	protected boolean isFailStep = false;
	
	public ActionManager(ActionContext context) {
		this.context = context;
	}

	public Predicate<WebElement> VISIBLE_FILTER = e -> {
		return !ExpectedConditions.stalenessOf(e).apply(context.driver) && e.isEnabled() && e.isDisplayed() && (e.getSize().getWidth() > 1 || e.getSize().getHeight() > 1);
	};// filter for only visible element
	
	/*
	 * Actions before each new page
	 */
	public ActionManager prePage() {
		// setup root element
		context.setRootElement(null);
		
		return this;
	}
	
	/*
	 * Open an url
	 */
	public ActionManager open(final String url) {
		context.getDriver().get(url);
		prePage();
		
		context.logAction(String.format(ACTION_LOG_FORMAT,"Open", url));		
		return this;
	}
	
	/*
	 * Find the input element based on guideWord and input value
	 */
	public ActionManager input(final String guideWord, final String value) {
		final WebElement element = pickItem(guideWord);
		
		if( element != null ) { 
			element.clear();
			element.sendKeys(value);	
			context.logAction(String.format(ACTION_LOG_FORMAT,"Input", value));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Input", value));
			isFailStep = true;
		}
		return this;
	}	
	
	/*
	 * Find the input element based on tagName,content of element and input value
	 */
	public ActionManager input(final String tagName, final String text, final String value) {
		final WebElement element = pickItem(tagName, text,true);
		
		if( element != null ) { 
			element.clear();
			element.sendKeys(value);	
			context.logAction(String.format(ACTION_LOG_FORMAT,"Input", value));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Input", value));
			isFailStep = true;
		}
		return this;
	}		
	
	/*
	 * Find the element based on guideWord and click it
	 */
	public ActionManager click(final String guideWord) {
		final WebElement element = pickItem(guideWord);
		
		if( element != null ) { 
			ElementHelper.click(context.driver,element);
			context.logAction(String.format(ACTION_LOG_FORMAT,"Click", guideWord));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Click", guideWord));
			isFailStep = true;
		}
		return this;
	}	
	
	/*
	 * Find first the element based on tagName,visible text and click it
	 */
	public ActionManager click(final String tagName, final String text) {
		final WebElement element = pickItem(tagName, text,false);
		
		if( element != null ) { 
			ElementHelper.click(context.driver,element);
			context.logAction(String.format(ACTION_LOG_FORMAT,"Click", text));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Click", text));
			isFailStep = true;
		}
		return this;
	}		
	
	/*
	 * Find the elements based on tagName and click the item at position index
	 */
	public ActionManager hoverAndclick(final String tagName, final int index) {
		final WebElement element = ElementHelper.pickItemByTag(tagName, index, context, VISIBLE_FILTER);
		
		if( element != null ) { 
			ElementHelper.moveAndClick(context.driver,element);
			context.logAction(String.format(ACTION_LOG_FORMAT,"Click", index));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Click", index));
			isFailStep = true;
		}
		return this;
	}	
	
	/*
	 * Find the first input element based on multiple tagNames,visible text and click it
	 */
	public ActionManager click(final List<String> tagNames, final String text) {
		WebElement element = null;
		for(String tagName:tagNames) {
			element = ElementHelper.pickItemByTag(tagName, text, context, VISIBLE_FILTER);
			if( element != null) break; //found
		}
		
		if( element != null ) { 
			ElementHelper.click(context.driver,element);
			context.logAction(String.format(ACTION_LOG_FORMAT,"Click", text));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Click", text));
			isFailStep = true;
		}
		return this;
	}	
	
	/*
	 * Find the root element based on guideWord and update it to context
	 */
	public ActionManager rootTo(final String guideWord) {
		// reset the root to [body] element first
		context.setRootElement(null);
		
		final WebElement element = ElementHelper.pickItem(guideWord, context, VISIBLE_FILTER);
		
		if( element != null ) { 
			context.setRootElement(element);
			context.logAction(String.format(ACTION_LOG_FORMAT,"Root to", guideWord));
		}else {
			context.logAction(String.format(ACTION_LOG_FORMAT,"[FAIL] - Root to", guideWord));
			isFailStep = true;
		}
		return this;
	}
	
	public ActionManager keyIn(final String value) {
		new Actions(context.getDriver()).sendKeys(value).build().perform();
		context.logAction(String.format(ACTION_LOG_FORMAT,"Key in", value));
		return this;
	}	 

	// sleep in seconds
	public ActionManager wait(int seconds) {
		try {
			Thread.sleep(seconds*1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return this;
	}
	
	public ActionContext getContext() {
		return context;
	}	
	
	/*
	 * Waiting for the page is ready.
	 */
	public ActionManager waitForLoad() {
		final WebDriver driver = context.getDriver();
		ExpectedCondition<Boolean> pageLoadCondition = new
				ExpectedCondition<Boolean>() {
			@Override
			public Boolean apply(WebDriver driver) {
				return ((JavascriptExecutor)driver).executeScript("return document.readyState").equals("complete");
			}
		};
		WebDriverWait wait = new WebDriverWait(driver, WAIT_LOAD_TIMEOUT);
		wait.until(pageLoadCondition);
		
		return this;
	}	
	
	/*
	 * Waiting for the page is ready and display the text
	 */
	public ActionManager waitForLoad(final String text) {
		final WebDriver driver = context.getDriver();
		ExpectedCondition<Boolean> pageLoadCondition = new
				ExpectedCondition<Boolean>() {
			@Override
			public Boolean apply(WebDriver driver) {
				return Boolean.TRUE.equals(((JavascriptExecutor)driver).executeScript(String.format("return document.readyState == 'complete' && "
						+ "document.documentElement.innerText.indexOf('%s') >= 0",text)));
			}
		};
		WebDriverWait wait = new WebDriverWait(driver, WAIT_LOAD_TIMEOUT);
		wait.until(pageLoadCondition);
		return this;
	}	
	
	/*
	 * Pick an item based on guideWord
	 */
	public WebElement pickItem(final String guideWord) {
		return ElementHelper.pickItem(guideWord, context, VISIBLE_FILTER);
	}
	
	/*
	 * Pick an item based on tagName,content of element or text of element
	 */
	public WebElement pickItem(final String tagName, final String text,boolean byElementContent) {
		return byElementContent?ElementHelper.pickItemByContent(tagName, text, context, VISIBLE_FILTER): ElementHelper.pickItemByTag(tagName, text, context, VISIBLE_FILTER);
	}

	public boolean isFailStep() {
		return isFailStep;
	}	
	
}
