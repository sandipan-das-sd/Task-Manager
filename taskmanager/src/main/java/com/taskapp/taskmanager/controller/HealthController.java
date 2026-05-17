package com.taskapp.taskmanager.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    private final DataSource dataSource;

    @Value("${server.port}")
    private String port;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {

        Map<String, Object> response = new HashMap<>();

        response.put("application", "Task Manager Backend");
        response.put("status", "Running");
        response.put("time", LocalDateTime.now());
        response.put("serverPort", port);

        try (Connection connection = dataSource.getConnection()) {

            response.put("databaseStatus", "Connected");

            response.put("databaseUrl", dbUrl);

            response.put("databaseUser", dbUsername);

            response.put(
                    "databaseProduct",
                    connection.getMetaData().getDatabaseProductName()
            );

            response.put(
                    "databaseVersion",
                    connection.getMetaData().getDatabaseProductVersion()
            );

            response.put(
                    "driverName",
                    connection.getMetaData().getDriverName()
            );

        } catch (Exception e) {

            response.put("databaseStatus", "Disconnected");

            response.put("error", e.getMessage());
        }

        return response;
    }
}