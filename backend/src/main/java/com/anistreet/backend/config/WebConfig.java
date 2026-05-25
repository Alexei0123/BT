package com.anistreet.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //Явно добавляем маршруты для SPA страниц
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/catalog").setViewName("forward:/index.html");
        registry.addViewController("/auth").setViewName("forward:/index.html");
        registry.addViewController("/profile").setViewName("forward:/index.html");
        registry.addViewController("/admin").setViewName("forward:/index.html");
        registry.addViewController("/product").setViewName("forward:/index.html");
        
        //Fallback для остальных путей (без точки в имени файла)
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/images/**")
            .addResourceLocations("file:uploads/images/");
    }
}