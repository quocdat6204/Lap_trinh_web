package Spring.API.qdb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"Spring.API.qdb", "Spring.API.qdb.config"})
public class QdbApplication {

	public static void main(String[] args) {
		SpringApplication.run(QdbApplication.class, args);
	}

}
