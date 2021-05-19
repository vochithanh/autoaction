package autoant.core;

import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URL;
import java.util.Collections;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.remote.Command;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.Dialect;
import org.openqa.selenium.remote.HttpCommandExecutor;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.Response;

public class AttachCommandExecutor extends HttpCommandExecutor {

	private String sessionId;

	public AttachCommandExecutor(URL addressOfRemoteServer, String sessionId) {
		super(addressOfRemoteServer);
		this.sessionId = sessionId;
	}
	
    protected void setPrivateFieldValue(String fieldName, Object newValue) {
        Class<?> superclass = getClass().getSuperclass();
        Throwable recentException = null;
        while (superclass != Object.class) {
            try {
                final Field f = superclass.getDeclaredField(fieldName);
                f.setAccessible(true);
                f.set(this, newValue);
                return;
            } catch (NoSuchFieldException | IllegalAccessException e) {
                recentException = e;
            }
            superclass = superclass.getSuperclass();
        }
        throw new WebDriverException(recentException);
    }	
    
    @Override
    public Response execute(Command command) throws IOException {
        Response response = null;
        if (command.getName() == "newSession") {
            response = new Response();
            response.setSessionId(sessionId.toString());
            response.setStatus(0);
            response.setValue(Collections.<String, String>emptyMap());
    		setPrivateFieldValue("commandCodec", Dialect.W3C.getCommandCodec());
    		setPrivateFieldValue("responseCodec", Dialect.W3C.getResponseCodec());            
        } else {
            response = super.execute(command);
        }
        return response;
    }    

	public static WebDriver buildAttachContext(final String url, final String session) {	
		WebDriver driver = null;
		try {
			driver = new RemoteWebDriver(new AttachCommandExecutor(new URL(url),session),new DesiredCapabilities());
		} catch (Exception e) {
			e.printStackTrace();
		}
        return driver;
	}    
	
	public static void printSessionData(final WebDriver driver) {
		RemoteWebDriver remoteDriver = (RemoteWebDriver) driver;		
		HttpCommandExecutor executor = (HttpCommandExecutor) remoteDriver.getCommandExecutor();
		final String url = executor.getAddressOfRemoteServer().toString();
		final String sessionId = remoteDriver.getSessionId().toString();	
		System.out.println(String.format("Url: %s, session: %s", url, sessionId));
	}
}

