package autoant.test;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

public class EtheriumTest extends BaseTestCase {

	@Test
	// Scan 400 page -> 10,000 accounts top balance in Main net
	public void accounts() throws IOException {
		var scanUrl = "https://etherscan.io/accounts/";
		var topA = new StringBuffer();
		// 1) Open pages
		for(int i = 1; i <= 400; i++){
			var table = manager.open(scanUrl + i).waitForLoad("Top Accounts by ETH Balance").rootTo("ContentPlaceHolder1_divTable").getContext().getRootElement();
			var rows = table.findElements(By.tagName("tr"));
			rows.remove(0); // remove header row

			manager.getContext().logAction("Number of rows: " + rows.size());
			rows.forEach( row ->{ // extract the address
				var address = row.findElement(By.tagName("a")).getText();
				topA.append(address).append(System.lineSeparator());
			});
		}

		// Write to file under home folder
		var userHomeDir = System.getProperty("user.home");
		Files.write(new File(userHomeDir + "/topA.log").toPath(), topA.toString().getBytes(), StandardOpenOption.CREATE);

		// VERIFY FINAL RESULT
		final List<String> logs = manager.getContext().getActionLogs();
		assertFalse( logs.stream().anyMatch( (log) -> log.contains("[FAIL]")), "There is FAIL step!");
	}
}
