package autoant.test;

import org.junit.jupiter.api.Test;

public class DemoTestSuite extends BaseTestCase {

	@Test
	public void openSite() {
		manager.open("http://www.google.com");
	}
}
