package autoant.core;

import java.util.Collections;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

/*
 * Helper class for actions on elements: [searching]
 */
public class ElementHelper {
	
	/*
	 * Pick an element based on guideWord with: [id,name,class,partial link]
	 */
	public static WebElement pickItem(String guideWord, ActionContext context, Predicate<WebElement> filter) {
		final WebElement root = context.getRootElement();

		// id
		WebElement result = pickFirst(root.findElements(By.id(guideWord)),filter);
		if( result != null ) return result;

		// name
		result = pickFirst(root.findElements(By.name(guideWord)),filter);
		if( result != null ) return result;
		
		// class
		result = pickFirst(root.findElements(By.className(guideWord)),filter);
		if( result != null ) return result;

		// link
		result = pickFirst(root.findElements(By.partialLinkText(guideWord)),filter);
		if( result != null ) return result;
		
		return null;
	}
	
	/*
	 * Pick all elements based on guideWord with: [id,name,class,partial link,tag]
	 */
	public static List<WebElement> pickItems(String guideWord, ActionContext context, Predicate<WebElement> filter) {
		final WebElement root = context.getRootElement();

		// id
		List<WebElement> result = filterList(root.findElements(By.id(guideWord)),filter);
		if( !result.isEmpty() ) return result;

		// name
		result = root.findElements(By.name(guideWord));
		if( !result.isEmpty() ) return result;

		// class
		result = root.findElements(By.className(guideWord));
		if( !result.isEmpty() ) return result;

		// link
		result = root.findElements(By.partialLinkText(guideWord));
		if( !result.isEmpty() ) return result;
		
		// tag
		result = root.findElements(By.tagName(guideWord));
		if( !result.isEmpty() ) return result;		

		return Collections.emptyList();
	}	
	
	/*
	 * Return list after filter
	 */
	protected static List<WebElement> filterList(final List<WebElement> list, Predicate<WebElement> filter){
		if( list != null && !list.isEmpty()) {
			return list.stream().filter(filter).collect(Collectors.toList());
		}else {
			return Collections.emptyList();
		}
	}
	
	/*
	 * Return first item match filter
	 */
	protected static WebElement pickFirst(final List<WebElement> list, Predicate<WebElement> filter){
		return pickItem(list,filter,1);
	}	
	
	/*
	 * Return n-th item match filter
	 */
	protected static WebElement pickItem(final List<WebElement> list, final Predicate<WebElement> filter, final int index){
		int count = 0;
		if( list != null && !list.isEmpty()) {
			for(WebElement ele:list) {
				if( filter.test(ele)) {
					count++;
					if(count == index) return ele;
				}
			}
		}
		return null;
	}		
	
	/*
	 * Pick an element with tagName and its text attribute contains text
	 */
	public static WebElement pickItemByTag(final String tagName, final String text, ActionContext context, Predicate<WebElement> filter) {
		final WebElement root = context.getRootElement();
		
		// Filter: element should contain text
		Predicate<WebElement> textFilter = ele ->{
			final String lcText = text.trim().toLowerCase();
			return filter.test(ele) && ( ele.getText().toLowerCase().contains(lcText));
		};
		
		return pickFirst(root.findElements(By.tagName(tagName)),textFilter);
	}
	
	/*
	 *  Pick an element with tagName and its "outerHTML" attribute contains text
	 */
	public static WebElement pickItemByContent(final String tagName, final String text, ActionContext context, Predicate<WebElement> filter) {
		final WebElement root = context.getRootElement();
		
		// Filter: element should contain text
		Predicate<WebElement> textFilter = ele ->{
			final String lcText = text.trim().toLowerCase();
			return filter.test(ele) && ( ele.getAttribute("outerHTML").toLowerCase().contains(lcText));
		};
		
		return pickFirst(root.findElements(By.tagName(tagName)),textFilter);
	}	
	
	/*
	 * Return n-th item with tagName, and match filter
	 */
	public static WebElement pickItemByTag(final String tagName, final int index, ActionContext context, Predicate<WebElement> filter) {
		final WebElement root = context.getRootElement();				
		return pickItem(root.findElements(By.tagName(tagName)),filter,index);
	}	
	
	/*
	 * Some browser (e.g. Firefox) will raise error when moving to element out of screen view, so we need to scroll to it first
	 */
	public static void scrollTo(final WebDriver driver, final WebElement element) {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
	}	
	
	// Scroll to, move to and click
	public static void moveAndClick(final WebDriver driver, final WebElement element) {
		scrollTo(driver,element);		
		new Actions(driver).moveToElement(element).click().build().perform();
	}	
	
	// Click
	public static void click(final WebDriver driver, final WebElement element) {
		element.click();
	}	
}
