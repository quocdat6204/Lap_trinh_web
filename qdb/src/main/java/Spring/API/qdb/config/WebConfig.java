package Spring.API.qdb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Đã được cấu hình tự động, nhưng bạn có thể tùy chỉnh thêm
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
        // registry.addResourceHandler("/static/**")
        //     .addResourceLocations("classpath:/static/");
        // registry.addResourceHandler()
        //         .addResourceLocations("classpath:/static/");
    }
}
