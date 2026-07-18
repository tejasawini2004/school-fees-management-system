package feesmanagement;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBConnection.java
 * This class handles the database connection to MySQL.
 * It uses JDBC (Java Database Connectivity) to connect to the database.
 * 
 * Make sure MySQL Connector/J JAR is added to your project classpath.
 * XAMPP default: URL=localhost:3306, USERNAME=root, PASSWORD="" (blank)
 */
public class DBConnection {
    
    // Database connection details
    private static final String URL = "jdbc:mysql://localhost:3306/school_fees_db";
    private static final String USERNAME = "root";
    private static final String PASSWORD = ""; // XAMPP default has no password
    
    /**
     * Establishes and returns a connection to the MySQL database.
     * @return Connection object if successful, null if failed
     */
    public static Connection getConnection() {
        Connection connection = null;
        try {
            // Step 1: Load the MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Step 2: Establish connection using DriverManager
            connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            
        } catch (ClassNotFoundException e) {
            System.out.println("ERROR: MySQL JDBC Driver not found!");
            System.out.println("Please add mysql-connector-java.jar to your classpath.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("ERROR: Failed to connect to database!");
            System.out.println("Please check if XAMPP MySQL is running and database 'school_fees_db' exists.");
            e.printStackTrace();
        }
        return connection;
    }
    
    /**
     * Test method to verify database connection.
     * @return true if connection is successful
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            if (conn != null) {
                System.out.println("✅ Database connected successfully!");
                return true;
            }
        } catch (SQLException e) {
            System.out.println("❌ Connection test failed.");
            e.printStackTrace();
        }
        return false;
    }
}

